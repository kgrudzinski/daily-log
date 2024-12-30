
use tauri::State;
use crate::models::{
    Project,    
    Entry,
    Task,
    Category,
    TaskView,
    TaskParams,
    EntryView,
    EntryParams
};

use crate::datastore::Datastore;
use crate::database::DbError;
use crate::config::AppConfig;

fn stringify_err(err: DbError) -> String {
    match err {
        DbError::NoConnection => "Database is not opened".to_string(),
        DbError::Sql(e) => e.to_string(),
        DbError::NonUtf8Filename => "Filename contains non utf-8 characters".to_string()
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
pub fn get_task_list(ds: State<Datastore>) -> Vec<TaskView> {
    ds.get_items::<TaskView>().unwrap()
}

#[tauri::command]
pub fn get_tasks(params: TaskParams, ds: State<Datastore>) -> Result<Vec<TaskView>, String> {
    ds.get_items_filtered::<TaskView, TaskParams>(params).map_err(stringify_err)
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
pub fn get_entry_list(ds: State<Datastore>) -> Vec<EntryView> {
    ds.get_items::<EntryView>().unwrap()
}

#[tauri::command]
pub fn get_entries(params: EntryParams, ds: State<Datastore>) -> Result<Vec<EntryView>, String> {
    ds.get_items_filtered::<EntryView, EntryParams>(params).map_err(stringify_err)
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

#[derive(Clone, serde::Serialize)]
struct BackupPayload {
    pub success: bool,
    pub err: Option<String>
}

#[tauri::command]
pub fn backup_db(filename: &str, window: tauri::Window, ds: State<Datastore>, config: State<AppConfig>) {
    use std::path::Path;
    let config_data = config.data();
    let backuo_dir = config_data.backup_dir.as_ref().unwrap();
    let backup_path = Path::new(&backuo_dir).join(filename);
    log::debug!("backup_path: {:?}", backup_path);
    let res = ds.backup(backup_path);
    let payload = match res {
        Ok(_) => BackupPayload {
            success: true,
            err: None
        },
        Err(e) => {
            let e_str = stringify_err(e);
            log::error!("{}", e_str);
            BackupPayload {
                success: false,
                err: Some(e_str)
            }
        }
    };
    window.emit("db-backup-finished", payload).unwrap();
}