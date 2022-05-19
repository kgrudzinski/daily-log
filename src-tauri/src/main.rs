#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs::File;

use simplelog::{WriteLogger, LevelFilter, Config};
use tauri::{
  Manager,
  RunEvent
};
use app::{
  datastore::Datastore,
  models::{Project, Task, Entry, Category, TaskView},
  commands
};

const DB_INITIALIZED_EVENT: &str = "db-initialized";
const DB_INITIALIZE_ERROR_EVENT: &str = "db-initialize-error";

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String
}

fn main() {

  WriteLogger::init(LevelFilter::Debug, Config::default(), File::create("daily-log.log").unwrap()).unwrap();

  log::info!("Starting application");

  let mut ds = Datastore::new();
  ds.add_model_schema::<Project>();
  ds.add_model_schema::<Task>();
  ds.add_model_schema::<Entry>();
  ds.add_model_schema::<Category>();
  ds.add_model_schema::<TaskView>();

  let app = tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![
    commands::get_project_list,
    commands::add_project,
    commands::update_project,
    commands::delete_project,
    commands::get_task_list,
    commands::get_tasks,
    commands::add_task,
    commands::update_task,
    commands::delete_task,
    commands::get_entry_list,
    commands::get_entries,
    commands::add_entry,
    commands::update_entry,
    commands::delete_entry,
    commands::get_category_list,
    commands::add_category,
    commands::update_category,
    commands::delete_category,
    commands::get_db_version
  ])
  .manage(ds)
  .on_page_load(|win, payload| {
    log::info!("Url {} loaded", payload.url());
    let ds = win.state::<Datastore>();
    
    let res = ds.open("database.db");
    match res {
      Ok(info) => {
        log::info!("Database {} loaded. Version: {}", info.name, info.version);
        win.emit(DB_INITIALIZED_EVENT, info).unwrap();
      },
      Err(e) => {
        let err = e.to_string();
        log::error!("Error loading database: {}", err);
        win.emit(DB_INITIALIZE_ERROR_EVENT, Payload { message: err}).unwrap();
        ds.close().unwrap();
      }

     
    }
  })
  .build(tauri::generate_context!())    
    .expect("error while running tauri application");
    app.run(|handle, evt| {
      match evt {
        RunEvent::Exit => {
          log::info!("Closing application");
          let ds = handle.state::<Datastore>();
          let res = ds.close();
          match res {
            Ok(_) => log::info!("Database closed."),
            Err(e) => log::info!("Error closing database: {}", e)
          }
        },
        RunEvent::Ready => {
          log::info!("App ready!");
          log::info!("Sqlite version: {}", rusqlite::version());
        },
        _ => {}
      }
    })
}
