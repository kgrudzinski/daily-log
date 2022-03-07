
use rusqlite::{ToSql, Result as SqlResult, types::ToSqlOutput, Row, params};
use crate::database::{
    Database,
    DbResult
};

pub struct ModelSchema {
    select: String,
    insert: String,
    delete: String,
    update: String,
    relations: Vec<RelationSchema>
}

impl ModelSchema {
    pub fn new<T: Model>() -> Self {

        let fields = T::fields().join(",");
        let values: Vec<&'static str> = T::fields().iter().map(|_i| "?").collect();
        let values = values.join(",");

        let params: Vec<String> = T::fields().iter().map(|i| format!("{}=?", i)).collect();
        let params = params.join(",");

        Self {
            select: format!("SELECT {}, {} FROM {} ORDER BY {};", T::PRIMARY_KEY, fields, T::NAME, T::PRIMARY_KEY),
            insert: format!("INSERT INTO {}({}) VALUES({});", T::NAME, fields, values),
            delete: format!("DELETE FROM {} WHERE {} = ?;", T::NAME, T::PRIMARY_KEY),
            update: format!("UPDATE {} SET {} WHERE {} = ?;", T::NAME, params, T::PRIMARY_KEY),
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

    pub fn get<T: Model>(&self, db: &Database) -> DbResult<Vec<T>> {
        let mut res = db.query(&self.select, [], |row| {
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
        Self {
            name: table.into(),
            insert: format!("INSERT INTO {}({}, {}) VALUES(?, ?);", table, owner_col, item_col),
            select: format!("SELECT {} FROM {} WHERE {}=?;", item_col, table, owner_col),
            delete: format!("DELETE FROM {} WHERE {}=?;", table, owner_col),            
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

#[derive(Debug, serde::Serialize)]
pub struct Project {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub categories: Vec<u64>,
    pub status: Status
}

#[derive(Debug, serde::Serialize)]
pub struct Task {
    pub id: u64,
    pub name: String,
    pub description: String,
    pub category_id: u64,
    pub project_id: u64,
    pub status: Status
}

#[derive(Debug, serde::Serialize)] 
pub struct Entry {
    pub id: u64,
    pub description: String,
    pub task_id: u64,
    pub duration: u64,
    pub date: u64
}

#[derive(Debug, serde::Serialize)]
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

#[cfg(test)]
mod tests {

    use super::{
        ModelSchema,
        Model,         
        Category,
        Project
    };    

    #[test]
    fn category_model() {        
        let schema: ModelSchema = ModelSchema::new::<Category>();        
        assert_eq!(&schema.insert, "INSERT INTO Category(Name) VALUES(?);");
        assert_eq!(&schema.select, "SELECT CategoryId, Name FROM Category ORDER BY CategoryId;");
        assert_eq!(&schema.update, "UPDATE Category SET Name=? WHERE CategoryId = ?;");
        assert_eq!(&schema.delete, "DELETE FROM Category WHERE CategoryId = ?;");
    }

    #[test]
    fn project_model() {
        let schema: ModelSchema = ModelSchema::new::<Project>();       
        assert_eq!(&schema.insert, "INSERT INTO Projects(Name,Description,StatusId) VALUES(?,?,?);");
        assert_eq!(&schema.select, "SELECT ProjectId, Name,Description,StatusId FROM Projects ORDER BY ProjectId;");
        assert_eq!(&schema.update, "UPDATE Projects SET Name=?,Description=?,StatusId=? WHERE ProjectId = ?;");
        assert_eq!(&schema.delete, "DELETE FROM Projects WHERE ProjectId = ?;");
    }

    #[test]
    fn project_relation() {
        let schema: ModelSchema = Project::get_schema();
        assert_eq!(schema.relations.len(), 1);
        let relation = &schema.relations[0];
        assert_eq!(&relation.insert, "INSERT INTO ProjectCategory(ProjectId, CategoryId) VALUES(?, ?);");
        assert_eq!(&relation.select, "SELECT CategoryId FROM ProjectCategory WHERE ProjectId=?;");
        assert_eq!(&relation.delete, "DELETE FROM ProjectCategory WHERE ProjectId=?;");
    }
}