
use std::fmt;

use rusqlite::{ToSql, Result as SqlResult, types::ToSqlOutput, Row, params};
//use thiserror::Error;

use crate::database::{
    Database,
    DbResult,
    //DbError
};

use crate::query::{select, SelectQuery};
use crate::mutations::{delete_from, insert, update};
/*
#[derive(Debug, Clone, Copy)]
enum ModelOperation {
    Select,
    Update,
    Insert,
    Delete
}

impl fmt::Display for ModelOperation {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Self::Select => write!(f, "Select"),
            Self::Update => write!(f, "Update"),
            Self::Insert => write!(f, "Insert"),
            Self::Delete => write!(f, "Delete"),
        }        
    }
}


#[derive(Error, Debug)]
pub enum SchemaError {
    #[error("{0}")]
    Database(#[from]DbError),
    #[error("{0} operation is not supported")]
    NotSupported(ModelOperation)
}

#[derive(Debug, Clone, Copy)]
struct ModelOptions {
    select: bool,
    update: bool,
    insert: bool,
    delete: bool
}

impl Default for ModelOptions {
    fn default() -> Self {
        Self {
            select: true,
            update: true,
            insert: true,
            delete: true
        }
    }
}

pub type SchemaResult<T> = Result<T, SchemaError>;
*/

pub trait QueryFilter: fmt::Display {
    fn into_params(self) -> Vec<Box<dyn ToSql>>;
}

pub struct ModelSchema {
    select: SelectQuery,
    select_all: String,
    select_by_id: String,
    insert: String,
    delete: String,
    update: String,
    relations: Vec<RelationSchema>
}

impl ModelSchema {
    pub fn new<T: Model>() -> Self {

        let mut fields = vec![T::PRIMARY_KEY];
        fields.extend_from_slice(T::fields());
        let values: Vec<&'static str> = T::fields().iter().map(|_i| "?").collect();
        let params: Vec<(&str, &str)> = T::fields().iter().map(|it| (*it, "?")).collect();

        Self {
            select: select(&fields).from(T::NAME),
            select_all: select(&fields).from(T::NAME).order_by(T::PRIMARY_KEY).to_string(),
            select_by_id: select(&fields).from(T::NAME).where_(&format!("{} = ?", T::PRIMARY_KEY)).to_string(),            
            insert: insert(T::fields()).into(T::NAME).values(&values).to_string(),
            delete: delete_from(T::NAME).where_(&format!("{} = ?", T::PRIMARY_KEY)).to_string(),
            update: update(T::NAME).set(&params).where_(&format!("{} = ?", T::PRIMARY_KEY)).to_string(),
            relations: vec![]            
        }
    }

    pub fn add_relation(&mut self, rel: RelationSchema) {
        self.relations.push(rel);
    }

    pub fn insert(&self, mut data: ModelData, db: &Database) -> DbResult<u64> {        
        db.execute(&self.insert, rusqlite::params_from_iter(data.params))?;
        let res = db.get_last_rowid().map(|r| r as u64)?;        
        for i in 0..self.relations.len() {
            let rel = &self.relations[i];
            let mut rel_data = data.relations.get_mut(i).unwrap();
            rel_data.owner_id = res;
            rel.insert(rel_data, db)?;
        }
        Ok(res)
    }

    pub fn update(&self, data: ModelData, db: &Database) -> DbResult<()> {
        //When doing update, item's id must be added to the parameter list 
        let mut params = data.params;
        params.push(Box::new(data.pk));
        db.execute(&self.update, rusqlite::params_from_iter(params)).map(|_| ())?;
        for i in 0..self.relations.len() {
            let rel = &self.relations[i];
            let rel_data = &data.relations[i];
            rel.update(rel_data, db)?;
        }
        Ok(())
    }
    
    pub fn delete(&self, id: u64, delete_relations: bool, db: &Database) -> DbResult<()> {
        let res = db.execute(&self.delete, params!(id)).map(|_| ())?;
        if delete_relations {
            for rel in &self.relations {                
                rel.delete(id, db)?;
            }
        }
        Ok(res)
    }

    pub fn get_all<T: Model>(&self, db: &Database) -> DbResult<Vec<T>> {
        let mut res = db.query(&self.select_all, [], |row| {
            T::from_sql(row)
        })?;

        for rel in &self.relations {
            for i in 0..res.len() {
                let it = res.get_mut(i).unwrap();
                let data = rel.select(it.pk(), db)?;
                it.add_relation_data(&rel.name, data);
            }            
        }            
        Ok(res)
    }

    pub fn get_by_id<T: Model>(&self, id: u64, db: &Database) -> DbResult<T> {
        let mut res = db.query_one(&self.select_by_id, [id], |row| {
            T::from_sql(row)
        })?;

        for rel in &self.relations {                
                let data = rel.select(res.pk(), db)?;
                res.add_relation_data(&rel.name, data);
        }                    
        Ok(res)
    }

    pub fn get<T: Model, F: QueryFilter>(&self, filter: F, db: &Database) -> DbResult<Vec<T>> {
        let cond = filter.to_string();
        let params = filter.into_params();
        let select = self.select.clone().where_(&cond).to_string();
        let mut res = db.query(&select, rusqlite::params_from_iter(params), |row| {
            T::from_sql(row)
        })?;

        for rel in &self.relations {
            for i in 0..res.len() {
                let it = res.get_mut(i).unwrap();
                let data = rel.select(it.pk(), db)?;
                it.add_relation_data(&rel.name, data);
            }            
        }            
        Ok(res)
    }
}

pub struct ModelData {
    pk: u64,
    params: Vec<Box<dyn ToSql>>,
    relations: Vec<RelationData>
}

pub struct RelationSchema {
    name: String,
    select: String,
    insert: String,
    delete: String    
}

impl RelationSchema {
    pub fn new(table: &str, owner_col: &str, item_col: &str) -> Self {
        let where_clause = format!("{} = ?", owner_col);
        Self {
            name: table.into(),
            insert: insert(&[owner_col, item_col]).into(table).values(&["?", "?"]).to_string(),
            select: select(&[item_col]).from(table).where_(&where_clause).to_string(),
            delete: delete_from(table).where_(&where_clause).to_string(),
        }
    }

    pub fn select(&self, id: u64, db: &Database) -> DbResult<Vec<u64>> {
        db.query(&self.select, params![id], |row| {
            row.get(0)
        })
    }

    pub fn insert(&self, rel: &RelationData, db: &Database) -> DbResult<u64> {        
        let id = rel.owner_id;
        let len = rel.data.len();
        for it in &rel.data {
            db.execute(&self.insert, params![id, it])?;
        }
        Ok(len as u64)
    }

    //Deletes all old entries and inserts new
    pub fn update(&self, rel: &RelationData, db: &Database) -> DbResult<()> {        
        let id = rel.owner_id;        
        db.execute(&self.delete, params![id])?;
        for it in &rel.data {            
            db.execute(&self.insert, params![id, it])?;
        }
        Ok(())
    }

    pub fn delete(&self, owner_id: u64, db: &Database) -> DbResult<usize> {
        db.execute(&self.delete, params![owner_id])
    }
}

pub struct RelationData {
    data: Vec<u64>,
    owner_id: u64
}

pub trait Model: Sized {
    const NAME: &'static str;
    const PRIMARY_KEY: &'static str;    

    fn pk(&self) -> u64;
    fn fields() -> &'static [&'static str];
    fn get_schema() -> ModelSchema {
        ModelSchema::new::<Self>()
    }
    /*
    fn options() -> ModelOptions {
        ModelOptions::default()
    }*/

    fn into_data(self) -> ModelData;
    fn from_sql(r: &Row<'_>) -> SqlResult<Self>;
    fn add_relation_data(&mut self, _relation: &str, _data: Vec<u64>) {}
}

#[derive(Clone, Copy, Debug, serde::Serialize, serde::Deserialize)]
pub enum Status {
    Idle,
    InProgress,
    Completed
}

impl Default for Status {
    fn default() -> Self {
        Self::Idle
    }
}

impl From<u64> for Status {
    fn from(item: u64) -> Self {
        match item {
            1 => Self::Idle,
            2 => Self::InProgress,
            3 => Self::Completed,
            _ => Self::Idle
        }
    }
}

impl ToSql for Status {
    fn to_sql(&self) -> SqlResult<ToSqlOutput<'_>> {
        match *self {
            Self::Idle => (1_u64).to_sql(),
            Self::InProgress => (2_u64).to_sql(),
            Self::Completed => (3_u64).to_sql()
        }        
    }
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Project {
    pub id: u64,
    pub name: String,
    pub description: String,
    #[serde(skip)]
    pub categories: Vec<u64>,
    #[serde(skip)]
    pub status: Status
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Task {
    pub id: u64,
    pub name: String,
    pub description: String,
    #[serde(rename="categoryId")]
    pub category_id: u64,
    #[serde(rename="projectId")]
    pub project_id: u64,
    pub status: Status
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct TaskView {
    pub id: u64,
    pub name: String,
    pub description: String,
    #[serde(rename="categoryId")]
    pub category_id: u64,
    #[serde(rename="projectId")]
    pub project_id: u64,
    pub status: Status,
    #[serde(rename="categoryName")]
    pub category_name: String,
    #[serde(rename="projectName")]
    pub project_name: String,
}

#[derive(Debug, Default, serde::Deserialize)]
pub struct TaskParams {
    pub name: Option<String>,
    pub categories: Option<Vec<u64>>,
    pub projects: Option<Vec<u64>>,
    pub status: Option<Status>
}

#[derive(Debug, serde::Serialize, serde::Deserialize)] 
pub struct Entry {
    pub id: u64,
    pub description: String,
    #[serde(rename="taskId")]
    pub task_id: u64,
    pub duration: u64,
    pub date: u64
}

#[derive(Debug, serde::Serialize)]
pub struct EntryView {
    pub id: u64,
    pub description: String,
    pub task: String,    
    #[serde(rename="taskId")]
    pub task_id: u64,
    pub duration: u64,
    pub date: u64
}

#[derive(Debug, Default, serde::Deserialize)]
pub struct EntryParams {
    pub date: Option<u64>,
    pub from: Option<u64>,
    pub to: Option<u64>
}

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Category {
    pub id: u64,
    pub name: String
}

const PRIJECT_COLS: [&str; 3] = ["Name", "Description", "StatusId"];

impl Model for Project {
    const NAME: &'static str = "Projects";
    const PRIMARY_KEY: &'static str = "ProjectId";

    fn pk(&self) -> u64 {
        self.id
    }

    fn get_schema() -> ModelSchema {
        let mut schema = ModelSchema::new::<Self>();
        schema.add_relation(RelationSchema::new("ProjectCategory", "ProjectId", "CategoryId"));
        schema
    }

    fn into_data(self) -> ModelData {
        ModelData {
            pk: self.id,
            params: vec![Box::new(self.name), Box::new(self.description), Box::new(self.status)],
            relations: vec![RelationData {owner_id: self.id, data: self.categories}]
        }
    }

    fn fields() -> &'static[&'static str] {
        &PRIJECT_COLS
    }

    fn add_relation_data(&mut self, relation: &str, data: Vec<u64>) {
        if relation == "ProjectCategory" {
            self.categories = data;
        }
    }

    fn from_sql(r: &Row<'_>) -> SqlResult<Self> {
        let sts: u64 = r.get(3)?;
        Ok(Project{
            id: r.get(0)?,
            name: r.get(1)?,
            description: r.get(2)?,
            status: sts.into(),
            categories: Vec::new()
        })
    }
}

const TASK_COLS: [&str; 5] = ["Name", "Description", "CategoryId", "ProjectId", "StatusId"];

impl Model for Task {
    const NAME: &'static str = "Tasks";
    const PRIMARY_KEY: &'static str = "TaskId";

    fn pk(&self) -> u64 {
        self.id
    }
    
    fn into_data(self) -> ModelData {
        ModelData {
            pk: self.id,
            params:  vec![Box::new(self.name), Box::new(self.description), Box::new(self.category_id), Box::new(self.project_id), Box::new(self.status)],
            relations: vec![]
        }
    }

    fn fields() -> &'static[&'static str] {
        &TASK_COLS
    }

    fn from_sql(r: &Row<'_>) -> SqlResult<Self> {
        let sts: u64 = r.get(5)?;
        Ok(Task{
            id: r.get(0)?,
            name: r.get(1)?,
            description: r.get(2)?,
            category_id: r.get(3)?,
            project_id: r.get(4)?,
            status: sts.into(),            
        })
    }
}

const TASKVIEW_COLS: [&str; 7] = ["Name", "Description", "CategoryId", "ProjectId", "Status", "ProjectName", "CategoryName"];

impl Model for TaskView {
    const NAME: &'static str = "TaskView";
    const PRIMARY_KEY: &'static str = "Id";

    fn pk(&self) -> u64 {
        self.id
    }
    
    fn into_data(self) -> ModelData {
        ModelData {
            pk: self.id,
            params: vec![],
            relations: vec![]
        }
    }

    fn fields() -> &'static[&'static str] {
        &TASKVIEW_COLS
    }

    fn from_sql(r: &Row<'_>) -> SqlResult<Self> {
        let sts: u64 = r.get(5)?;
        Ok(TaskView{
            id: r.get(0)?,
            name: r.get(1)?,
            description: r.get(2)?,
            category_id: r.get(3)?,
            project_id: r.get(4)?,
            status: sts.into(),
            project_name: r.get(6)?,
            category_name: r.get(7)?
        })
    }
}

const ENTRY_COLS: [&str; 4] = ["Description", "TaskId", "Duration", "Date"];

impl Model for Entry {
    const NAME: &'static str = "Entries";
    const PRIMARY_KEY: &'static str = "EntryId";

    fn pk(&self) -> u64 {
        self.id
    }

    fn into_data(self) -> ModelData {
        ModelData {
            pk: self.id,
            params: vec![Box::new(self.description), Box::new(self.task_id), Box::new(self.duration), Box::new(self.date)], 
            relations: vec![]
        }
    }

    fn fields() -> &'static[&'static str] {
        &ENTRY_COLS
    }

    fn from_sql(r: &Row<'_>) -> SqlResult<Self> {        
        Ok(Entry{
            id: r.get(0)?,            
            description: r.get(1)?,
            task_id: r.get(2)?,
            duration: r.get(3)?,
            date: r.get(4)?
        })
    }
}

const ENTRY_VIEW_COLS: [&str; 5] = ["Description", "Task", "TaskId", "Duration", "Date"];

impl Model for EntryView {
    const NAME: &'static str = "EntryView";
    const PRIMARY_KEY: &'static str = "Id";

    fn pk(&self) -> u64 {
        self.id
    }

    fn into_data(self) -> ModelData {
        ModelData {
            pk: self.id,
            params: vec![Box::new(self.description), Box::new(self.task), Box::new(self.task_id), Box::new(self.duration), Box::new(self.date)], 
            relations: vec![]
        }
    }

    fn fields() -> &'static[&'static str] {
        &ENTRY_VIEW_COLS
    }

    fn from_sql(r: &Row<'_>) -> SqlResult<Self> {        
        Ok(EntryView{
            id: r.get(0)?,            
            description: r.get(1)?,
            task: r.get(2)?,
            task_id: r.get(3)?,
            duration: r.get(4)?,
            date: r.get(5)?
        })
    }
}

const CATEGORY_COLS: [&str; 1] = ["Name"];

impl Model for Category {
    const NAME: &'static str = "Category";
    const PRIMARY_KEY: &'static str = "CategoryId";

    fn pk(&self) -> u64 {
        self.id
    }

    fn into_data(self) -> ModelData {
        ModelData {
            pk: self.id,
            params: vec![Box::new(self.name)],
            relations: vec![]
        }
    }
    
    fn fields() -> &'static[&'static str] {
        &CATEGORY_COLS
    }

    fn from_sql(r: &Row<'_>) -> SqlResult<Self> {        
        Ok(Category{
            id: r.get(0)?,            
            name: r.get(1)?,            
        })
    }
}

macro_rules! gen_expr{
    ($items: ident, $field: expr, $op: literal, $col: literal) => {
        if $field.is_some() {
            $items.push(format!("{} {} ?", $col, $op));
        }
    }
}

macro_rules! gen_in_expr{
    ($items: ident, $arr_field: expr, $col: literal) => {
        if let Some(arr) = &$arr_field {
            let params = arr.iter().map(|_it| "?").collect::<Vec<&'static str>>().join(", ");
            $items.push(format!("{} IN ({})", $col, params));
        }
    }
}

impl fmt::Display for TaskParams {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut items: Vec<String> = Vec::new();
        gen_expr!(items, self.name, "LIKE", "Name");
        gen_expr!(items, self.status, "=", "StatusId");       
        gen_in_expr!(items, self.categories, "CategoryId");
        gen_in_expr!(items, self.projects, "ProjectId");
        
        write!(f, "{}", items.join(" AND "))
    }
}

impl QueryFilter for TaskParams {
    fn into_params(self) -> Vec<Box<dyn ToSql>> {
        let mut params: Vec<Box<dyn ToSql>> = Vec::new();

        if let Some(name) = self.name {
            params.push(Box::new(name));
        }

        if let Some(status) = self.status {
            params.push(Box::new(status));
        }

        if let Some(categories) = self.categories {
            for it in categories {
                params.push(Box::new(it));
            }
        }

        if let Some(projects) = self.projects {
            for it in projects {
                params.push(Box::new(it));
            }
        }

        params
    }
}

impl fmt::Display for EntryParams {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut items: Vec<String> = Vec::new();        
        gen_expr!(items, self.date, "=", "Date");
        gen_expr!(items, self.from, ">=", "Date");
        gen_expr!(items, self.to, "<=", "Date");        
        
        write!(f, "{}", items.join(" AND "))
    }
}

impl QueryFilter for EntryParams {
    fn into_params(self) -> Vec<Box<dyn ToSql>> {
        let mut params: Vec<Box<dyn ToSql>> = Vec::new();

        if let Some(date) = self.date {
            params.push(Box::new(date));
        }

        if let Some(from) = self.from {
            params.push(Box::new(from));
        }

        if let Some(to) = self.to {
            params.push(Box::new(to));
        }

        params
    }
}

#[cfg(test)]
mod tests {

    use super::{
        ModelSchema,
        Model,         
        Category,
        Project,
        Task,        
        TaskParams,
        EntryParams,
        Status,
    };    

    #[test]
    fn category_model() {        
        let schema: ModelSchema = ModelSchema::new::<Category>();        
        assert_eq!(&schema.insert, "INSERT INTO Category(Name) VALUES(?)");
        assert_eq!(&schema.select_all, "SELECT CategoryId, Name FROM Category ORDER BY CategoryId ASC");
        assert_eq!(&schema.select_by_id, "SELECT CategoryId, Name FROM Category WHERE CategoryId = ?");
        assert_eq!(&schema.update, "UPDATE Category SET Name = ? WHERE CategoryId = ?");
        assert_eq!(&schema.delete, "DELETE FROM Category WHERE CategoryId = ?");
    }

    #[test]
    fn project_model() {
        let schema: ModelSchema = ModelSchema::new::<Project>();       
        assert_eq!(&schema.insert, "INSERT INTO Projects(Name, Description, StatusId) VALUES(?, ?, ?)");        
        assert_eq!(&schema.select_all, "SELECT ProjectId, Name, Description, StatusId FROM Projects ORDER BY ProjectId ASC");
        assert_eq!(&schema.select_by_id, "SELECT ProjectId, Name, Description, StatusId FROM Projects WHERE ProjectId = ?");        
        assert_eq!(&schema.update, "UPDATE Projects SET Name = ?, Description = ?, StatusId = ? WHERE ProjectId = ?");
        assert_eq!(&schema.delete, "DELETE FROM Projects WHERE ProjectId = ?");
    }

    #[test]
    fn project_relation() {
        let schema: ModelSchema = Project::get_schema();
        assert_eq!(schema.relations.len(), 1);
        let relation = &schema.relations[0];
        assert_eq!(&relation.insert, "INSERT INTO ProjectCategory(ProjectId, CategoryId) VALUES(?, ?)");
        assert_eq!(&relation.select, "SELECT CategoryId FROM ProjectCategory WHERE ProjectId = ?");
        assert_eq!(&relation.delete, "DELETE FROM ProjectCategory WHERE ProjectId = ?");
    }

    #[test]
    fn task_model() {
        let schema: ModelSchema = ModelSchema::new::<Task>();        
        assert_eq!(&schema.insert, "INSERT INTO Tasks(Name, Description, CategoryId, ProjectId, StatusId) VALUES(?, ?, ?, ?, ?)");
        assert_eq!(&schema.select_all, "SELECT TaskId, Name, Description, CategoryId, ProjectId, StatusId FROM Tasks ORDER BY TaskId ASC");
        assert_eq!(&schema.select_by_id, "SELECT TaskId, Name, Description, CategoryId, ProjectId, StatusId FROM Tasks WHERE TaskId = ?");
        assert_eq!(&schema.update, "UPDATE Tasks SET Name = ?, Description = ?, CategoryId = ?, ProjectId = ?, StatusId = ? WHERE TaskId = ?");
        assert_eq!(&schema.delete, "DELETE FROM Tasks WHERE TaskId = ?");
    }

    #[test]
    fn task_filter() {
        let params1 = TaskParams {
            name: Some("test task".to_string()),
            ..Default::default()
        };

        let params2 = TaskParams {
            status: Some(Status::InProgress),
            categories: Some(vec![1, 2]),
            ..Default::default()
        };

        let params3 = TaskParams {
            projects: Some(vec![1, 2]),
            categories: Some(vec![1, 2]),
            ..Default::default()
        };

        assert_eq!(params1.to_string(), "Name LIKE ?");
        assert_eq!(params2.to_string(), "StatusId = ? AND CategoryId IN (?, ?)");
        assert_eq!(params3.to_string(), "CategoryId IN (?, ?) AND ProjectId IN (?, ?)");
    }

    #[test]
    fn entry_filter() {
        let params1 = EntryParams {
            date: Some(1),
            ..Default::default()
        };

        let params2 = EntryParams {
            from: Some(1),
            to: Some(2),
            ..Default::default()
        };

        assert_eq!(params1.to_string(), "Date = ?");
        assert_eq!(params2.to_string(), "Date >= ? AND Date <= ?");
    }
}