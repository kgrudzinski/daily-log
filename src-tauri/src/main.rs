#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod database;
mod sql;
mod models;
mod commands;
mod datastore;

use log;
use tauri::{
  Manager,
  Event
};
use datastore::Datastore;
use commands::*;

const DB_INITIALIZED_EVENT: &str = "db-initialized";
const DB_INITIALZE_ERROR_EVENT: &str = "db-initialize-error";

#[derive(serde::Serialize)]
struct Payload {
  message: String
}

fn main() {
  let app = tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![
    commands::get_project_list,
    commands::add_project,
    commands::update_project,
    commands::get_task_list,
    commands::add_task,
    commands::update_task,
    commands::delete_task,
    commands::get_entry_list,
    commands::add_entry,
    commands::update_entry,
    commands::delete_entry,
    commands::get_category_list,
    commands::add_category,
    commands::update_category,
    commands::delete_category
  ])
  .manage(Datastore::new())
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
        win.emit(DB_INITIALZE_ERROR_EVENT, Payload { message: err}).unwrap(); 
      }

     
    }
  })
  .build(tauri::generate_context!())    
    .expect("error while running tauri application");
    app.run(|handle, evt| {
      match evt {
        Event::Exit => {
          log::info!("Closing application");
          let ds = handle.state::<Datastore>();
          let res = ds.close();
          match res {
            Ok(_) => log::info!("Database closed."),
            Err(e) => log::info!("Error closing database: {}", e)
          }
        },
        Event::Ready => {
          log::info!("App ready!");
        },
        _ => {}
      }
    })
}
