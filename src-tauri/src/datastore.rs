
use crate::{database::{
    Database, 
    DbResult
}, models::QueryFilter};

use std::{
    collections::HashMap,
    any::TypeId,
    path::Path,
};

use crate::models::{
    Model, ModelSchema
};

#[derive(Default, Debug, Clone, serde::Serialize)]
pub struct DatastoreInfo {
    pub name: String,
    pub version: u32
}

pub struct Datastore {    
    db: Database,
    models: HashMap<TypeId, ModelSchema>
}

impl Datastore {
    pub fn new() -> Self {
        Self {
            db: Database::new(),
            models: HashMap::new()
        }
    }

    pub fn open<P>(&self, filename: P) -> DbResult<DatastoreInfo> where P: AsRef<Path> {        
        let exists = filename.as_ref().exists();
        if exists {
            log::info!("Opening database {}", filename.as_ref().display());
            self.db.open(filename)?;
        } else {
            log::info!("Creating database {}", filename.as_ref().display());
            self.db.open(filename)?;
            self.create_new_db(&crate::sql::get_schemas(), None)?;
        }
        self.get_info()
    }

    fn create_new_db(&self, schemas: &[&str], name: Option<&str>) -> DbResult<()> {
        for schema in schemas {
            self.db.execute_script(schema)?;
        }
        if let Some(db_name) = name {
            self.db.execute("UPDATE TABLE Database SET Name = ?", [db_name])?;
        }
        Ok(())
    }

    pub fn get_info(&self) -> DbResult<DatastoreInfo> {
        self.db.query_one("SELECT Name, Version FROM Database;", [], |row| {
            Ok(DatastoreInfo{
                name: row.get(0)?,
                version: row.get(1)?
            })
        })
    }

    pub fn close(&self) -> DbResult<()> {
        self.db.close()
    }

    pub fn add_model_schema<T: Model+'static>(&mut self) {
        let id = TypeId::of::<T>();
        self.models.insert(id, T::get_schema());
    }

    pub fn insert_item<T: Model+'static>(&self, item: T) -> DbResult<u64> {
        let id = TypeId::of::<T>();
        let m = self.models.get(&id).unwrap();
        m.insert(item.into_data(), &self.db)
    }

    pub fn update_item<T: Model+'static>(&self, item: T) -> DbResult<()> {
        let id = TypeId::of::<T>();
        let m = self.models.get(&id).unwrap();
        m.update(item.into_data(), &self.db)
    }

    pub fn delete_item<T: Model+'static>(&self, item_id: u64) -> DbResult<()> {
        let id = TypeId::of::<T>();
        let m = self.models.get(&id).unwrap();
        m.delete(item_id, false, &self.db)
    }

    pub fn get_items<T: Model+'static>(&self) -> DbResult<Vec<T>> {
        let id = TypeId::of::<T>();
        let m = self.models.get(&id).unwrap();
        m.get_all(&self.db)
    }

    pub fn get_items_filtered<T: Model+'static, F: QueryFilter>(&self, filter: F) -> DbResult<Vec<T>> {
        let id = TypeId::of::<T>();
        let m = self.models.get(&id).unwrap();
        m.get(filter, &self.db)
    }

    pub fn backup<P>(&self, path: P) -> DbResult<()> where P: AsRef<Path> {
        self.db.backup(path)
    }
}

#[cfg(test)]
mod tests {
    use super::Datastore;
    use crate::models::{
        Category,
        Project,
        Task,
        Status, 
        TaskParams
    };

    fn cleanup(filename: &str) {
        use std::path::Path;
        let exists = Path::new(filename).exists();
        if exists {
            let _ = std::fs::remove_file(filename);
        }
    }

    fn setup_db(filename: &str) -> Datastore {        
        let mut ds = Datastore::new();
        let _ = ds.open(filename).unwrap();
        ds.add_model_schema::<Category>();
        ds.add_model_schema::<Project>();
        ds.add_model_schema::<Task>();
        
        let _ = ds.insert_item(Category {
            id: 0,
            name: "Kategoria 1".to_string()
        }).unwrap();
        let _ = ds.insert_item(Category {
            id: 0,
            name: "Kategoria 2".to_string()
        }).unwrap();

        let _ = ds.insert_item(Project {
            id: 0,
            name: "Project 1".to_string(),
            description: "Opis".to_string(),
            status: Status::Idle,
            categories: vec![1, 2]
        }).unwrap(); 
        
        let _ = ds.insert_item(Project {
            id: 0,
            name: "Project 2".to_string(),
            description: "Opis".to_string(),
            status: Status::Idle,
            categories: vec![1, 2]
        }).unwrap(); 
        ds
    }

    #[test]
    fn test_datastore_insert() {
        const DB_NAME: &str = "test_1.db";
        let mut ds = Datastore::new();
        let _ = ds.open(DB_NAME).unwrap();
        ds.add_model_schema::<Category>();
        let res = ds.insert_item(Category {
            id: 0,
            name: "Kategoria".to_string()
        }).unwrap();
        let _ = ds.close().unwrap();
        cleanup(DB_NAME);
        assert_eq!(res, 1);
    }

    #[test]
    fn test_datastore_select() {
        const DB_NAME: &str = "test_2.db";
        let mut ds = Datastore::new();
        let _ = ds.open(DB_NAME).unwrap();
        ds.add_model_schema::<Category>();
        let res = ds.insert_item(Category {
            id: 0,
            name: "Kategoria".to_string()
        }).unwrap();
        assert_eq!(res, 1);
        let items = ds.get_items::<Category>().unwrap();
        let _ = ds.close().unwrap();
        cleanup(DB_NAME);
        assert_eq!(items.len(), 1);
        assert_eq!(items[0].name, "Kategoria");
        assert_eq!(items[0].id, 1);
    }

    #[test]
    fn test_datastore_insert_with_relation() {
        const DB_NAME: &str = "test_3.db";
        let mut ds = Datastore::new();
        let _ = ds.open(DB_NAME).unwrap();
        ds.add_model_schema::<Category>();
        ds.add_model_schema::<Project>();
        let _ = ds.insert_item(Category {
            id: 0,
            name: "Kategoria 1".to_string()
        }).unwrap();
        let _ = ds.insert_item(Category {
            id: 0,
            name: "Kategoria 2".to_string()
        }).unwrap();

        let _ = ds.insert_item(Project {
            id: 0,
            name: "Project".to_string(),
            description: "Opis".to_string(),
            status: Status::Idle,
            categories: vec![1, 2]
        }).unwrap();

        let items = ds.get_items::<Project>().unwrap();
        let _ = ds.close().unwrap();
        cleanup(DB_NAME);
        assert_eq!(items[0].categories, vec![1, 2]);
    }

    #[test]
    fn test_datastore_delete() {
        const DB_NAME: &str = "test_4.db";
        let mut ds = Datastore::new();
        let _ = ds.open(DB_NAME).unwrap();
        ds.add_model_schema::<Category>();
        let _ = ds.insert_item(Category {
            id: 0,
            name: "Kategoria".to_string()
        }).unwrap();

        let res = ds.delete_item::<Category>(1);
        assert!(res.is_ok());
        let _ = ds.close().unwrap();
        cleanup(DB_NAME);
    }

    #[test]
    fn test_datastore_update() {
        const DB_NAME: &str = "test_5.db";
        let mut ds = Datastore::new();
        let _ = ds.open(DB_NAME).unwrap();
        ds.add_model_schema::<Category>();
        let res = ds.insert_item(Category {
            id: 0,
            name: "Kategoria".to_string()
        });
        assert!(res.is_ok());
        let id = res.unwrap_or_default();
        assert_eq!(1, id);

        let res = ds.update_item::<Category>(Category {
            id: id,
            name: "Kategoria2".to_string()
        });
        assert!(res.is_ok());

        let items = ds.get_items::<Category>().unwrap();
        assert_eq!(items[0].name, "Kategoria2");
        assert_eq!(items[0].id, 1);
        let _ = ds.close().unwrap();
        cleanup(DB_NAME);
    }

    #[test]
    fn test_datastore_select_filtered() {

        const DB_NAME: &str = "test_6.db";
        let ds = setup_db(DB_NAME);
       
        let task_1 = Task {
            id: 0,
            name: "Task 1".to_string(),
            description: "Opis".to_string(),
            status: Status::InProgress,
            project_id: 1,
            category_id: 1,
        };

        let task_2 = Task {
            id: 0,
            name: "Task 2".to_string(),
            description: "Opis".to_string(),
            status: Status::InProgress,
            project_id: 1,
            category_id: 2,
        };

        let task_3 = Task {
            id: 0,
            name: "Task 3".to_string(),
            description: "Opis".to_string(),
            status: Status::InProgress,
            project_id: 2,
            category_id: 1,
        };

        let task_4 = Task {
            id: 0,
            name: "Task 4".to_string(),
            description: "Opis".to_string(),
            status: Status::Completed,
            project_id: 2,
            category_id: 2,
        };

        let res = ds.insert_item(task_1);
        if let Err(err) = res {
            println!("{}", err);
            let _ = ds.close().unwrap();
            cleanup(DB_NAME);
        }
        
        let _ = ds.insert_item(task_2).unwrap();
        let _ = ds.insert_item(task_3).unwrap();
        let _ = ds.insert_item(task_4).unwrap();

        let filter_1 = TaskParams {
            name: Some("Task 1".to_string()),
            ..Default::default()
        };

        let filter_2 = TaskParams {
            categories: Some(vec![1]),
            ..Default::default()
        };

        let filter_3 = TaskParams {
            projects: Some(vec![2]),
            status: Some(Status::Completed),
            ..Default::default()
        };

        
        let items1 = ds.get_items_filtered::<Task, TaskParams>(filter_1).unwrap();
        let items2 = ds.get_items_filtered::<Task, TaskParams>(filter_2).unwrap();
        let items3 = ds.get_items_filtered::<Task, TaskParams>(filter_3).unwrap();
        
        let _ = ds.close().unwrap();
        cleanup(DB_NAME);      

        assert_eq!(items1.len(), 1);
        assert_eq!(items1[0].id, 1);

        
        assert_eq!(items2.len(), 2);
        assert_eq!(items2[0].id, 1);
        assert_eq!(items2[1].id, 3);

        
        assert_eq!(items3.len(), 1);
        assert_eq!(items3[0].id, 4);          
    }
}