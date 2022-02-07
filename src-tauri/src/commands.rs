
use tauri::State;
use crate::models::{
    Project,
    Status,
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
pub fn add_project(name: String, description: String, categories: Vec<u64>, ds: State<Datastore>) -> Result<u64, String> {
    let item = Project {
        id: 0,
        name,
        description,
        status: Status::Idle,
        categories
    };

    ds.insert_item::<Project>(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_project(id: u64, name: String, description: String, status: Status, categories: Vec<u64>, ds: State<Datastore>) -> Result<(), String> {
    let item = Project {
        id,
        name,
        description,
        status,
        categories
    };

    ds.update_item(item).map_err(stringify_err)
}

// categories
#[tauri::command]
pub fn get_category_list(ds: State<Datastore>) -> Vec<Category> {
    ds.get_items::<Category>().unwrap()
}

#[tauri::command]
pub fn add_category(name: String, ds: State<Datastore>) -> Result<u64, String> {
    let item = Category {
        id: 0,
        name
    };
    ds.insert_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_category(id: u64, name: String, ds: State<Datastore>) -> Result<(), String> {
    let item = Category {
        id,
        name
    };
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
pub fn add_task(name: String, description: String, category: u64, project: u64, status: Status, ds: State<Datastore>) -> Result<u64, String> {
    let item = Task {
        id: 0,
        name,
        description,
        category_id: category,
        project_id: project,
        status
    };

    ds.insert_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_task(id: u64, name: String, description: String, category: u64, project: u64, status: Status, ds: State<Datastore>) -> Result<(), String> {
    let item = Task {
        id,
        name,
        description,
        category_id: category,
        project_id: project,
        status
    };

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
pub fn add_entry(description: String, task: u64, duration: u64, date: u64, ds: State<Datastore>) -> Result<u64, String> {
    let item = Entry {
        id: 0,
        description,
        task_id: task,
        duration,
        date
    };

    ds.insert_item(item).map_err(stringify_err)
}

#[tauri::command]
pub fn update_entry(id: u64, description: String, task: u64, duration: u64, date: u64, ds: State<Datastore>) -> Result<(), String> {
    let item = Entry {
        id,
        description,
        task_id: task,
        duration,
        date
    };

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