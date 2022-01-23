
use crate::database::{
    Database, 
    DbResult
};

use std::{
    collections::HashMap,
    any::TypeId
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

    pub fn open(&self, filename: &str) -> DbResult<DatastoreInfo> {
        use std::path::Path;
        let exists = Path::new(filename).exists();
        if exists {
            log::info!("Opening database {}", filename);
            self.db.open(filename)?;
        } else {
            log::info!("Creating database {}", filename);
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
        m.get(&self.db)
    }
}