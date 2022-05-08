
use tauri::State;
use crate::models::{
    Project,    
    Entry,
    Task,
    Category
};

use crate::datastore::Datastore;
use crate::database::DbError;

fn stringify_err(err: DbError) -> String {
    match err {
        DbError::NoConnection => "Database is not opened".to_string(),
        DbError::Sql(e) => e.to_string()
    }
}

// projects

#[tauri::command]
pub fn get_project_list(ds: State<Datastore>) -> Vec<Project> {
    ds.get_items::<Project>().unwrap()
}

#[tauri::command]
pub fn add_project(item: Project, ds: State<Datastore>) -> Result<u64, String> {    
    ds.insert_item::<Project>(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_project(item: Project, ds: State<Datastore>) -> Result<(), String> {    
    ds.update_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn delete_project(id: u64, ds: State<Datastore>) -> Result<(), String> {
    ds.delete_item::<Project>(id).map_err(stringify_err)
}

// categories
#[tauri::command]
pub fn get_category_list(ds: State<Datastore>) -> Vec<Category> {
    ds.get_items::<Category>().unwrap()
}

#[tauri::command]
pub fn add_category(item: Category, ds: State<Datastore>) -> Result<u64, String> {   
    ds.insert_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_category(item: Category, ds: State<Datastore>) -> Result<(), String> {   
    ds.update_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn delete_category(id: u64, ds: State<Datastore>) -> Result<(), String> {
    ds.delete_item::<Category>(id).map_err(stringify_err)
}

//Tasks
#[tauri::command]
pub fn get_task_list(ds: State<Datastore>) -> Vec<Task> {
    ds.get_items::<Task>().unwrap()
}

#[tauri::command]
pub fn add_task(item: Task, ds: State<Datastore>) -> Result<u64, String> {   
    ds.insert_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_task(item: Task, ds: State<Datastore>) -> Result<(), String> {    
    ds.update_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn delete_task(id: u64, ds: State<Datastore>) -> Result<(), String> {
    ds.delete_item::<Task>(id).map_err(stringify_err)
}

//entries
#[tauri::command]
pub fn get_entry_list(ds: State<Datastore>) -> Vec<Entry> {
    ds.get_items::<Entry>().unwrap()
}

#[tauri::command]
pub fn add_entry(item: Entry, ds: State<Datastore>) -> Result<u64, String> {    
    ds.insert_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_entry(item: Entry, ds: State<Datastore>) -> Result<(), String> {    
    ds.update_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn delete_entry(id: u64, ds: State<Datastore>) -> Result<(), String> {
    ds.delete_item::<Entry>(id).map_err(stringify_err)
}

#[tauri::command]
pub fn get_db_version(window: tauri::Window, ds: State<Datastore>) {
    window.emit("db-initialized", ds.get_info().unwrap()).unwrap();
}