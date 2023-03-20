#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{
  fs::{File, create_dir_all}, 
  path::PathBuf,  
};

use simplelog::{WriteLogger, LevelFilter, Config};
use tauri::{
  Manager,
  RunEvent,
  PathResolver,
  api::path::BaseDirectory,  
};
use app::{
  datastore::Datastore,
  models::{Project, Task, Entry, Category, TaskView, EntryView},
  commands,
  config::AppConfig
};

#[cfg(debug_assertions)]
const DEBUG_MODE: bool = true;
#[cfg(not(debug_assertions))]
const DEBUG_MODE: bool = false;

const DB_INITIALIZED_EVENT: &str = "db-initialized";
const DB_INITIALIZE_ERROR_EVENT: &str = "db-initialize-error";
const FRONTEND_READY_EVENT: &str = "frontend-ready";

const LOG_FILE_NAME: &str = "daily-log.log";
const CONFIG_FILE_NAME: &str = "config.json";
const DATABASE_FILE_NAME: &str = "database.sqlite";

#[derive(Clone, serde::Serialize)]
struct Payload {
  message: String
}

fn main() {

  let mut ds = Datastore::new();
  ds.add_model_schema::<Project>();
  ds.add_model_schema::<Task>();
  ds.add_model_schema::<Entry>();
  ds.add_model_schema::<Category>();
  ds.add_model_schema::<TaskView>();
  ds.add_model_schema::<EntryView>();

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
  .setup(|app| {
    let path_resolver = app.path_resolver();
    let log_path = get_app_path(BaseDirectory::AppLog, LOG_FILE_NAME, &path_resolver);
    
    WriteLogger::init(LevelFilter::Debug, Config::default(), File::create(log_path).unwrap()).unwrap();

    log::info!("Starting application");
    log::info!("Debug mode: {}", DEBUG_MODE);
    log::info!("Quering data");
    
    log::info!("App folder: {:?}", path_resolver.app_data_dir());
    log::info!("App local folder: {:?}", path_resolver.app_local_data_dir());
    log::info!("log folder: {:?}", path_resolver.app_log_dir());
    log::info!("config folder {:?}", path_resolver.app_config_dir());


    let config_path = get_app_path(BaseDirectory::AppConfig, CONFIG_FILE_NAME, &path_resolver);    
    let config = AppConfig::new(&config_path);
    app.manage::<AppConfig>(config);

    log::info!("Registering event handlers");
    let win = app.get_window("main").unwrap();
    let app_handle = app.app_handle().clone();
    let _id = win.listen(FRONTEND_READY_EVENT, move |_| {
      log::info!("Received frontend event: {}", FRONTEND_READY_EVENT);
      let win = app_handle.get_window("main").unwrap();      
      let ds = win.state::<Datastore>();
      let config = win.state::<AppConfig>();
      let mut config_data = config.data();
      let db_path = if let Some(path) = &config_data.database {
        log::info!("Database path: {}", path);
        let mut buf = PathBuf::new();
        buf.push(path);
        buf
      } else {
        let path = get_app_path(BaseDirectory::AppData, DATABASE_FILE_NAME, &path_resolver);
        config_data.set_database(&path);
        drop(config_data);
        match config.save() {
          Ok(_) => log::info!("New configuration saved."),
          Err(e) => log::error!("Error saving configuration: {e}")
        }        
        path
      };      
      let res = ds.open(db_path);
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
      }});      
      Ok(())
  })
  .on_page_load(|_, payload| {
    log::info!("Url {} loaded", payload.url());
    /*
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
    }*/
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

fn get_app_path(dir: BaseDirectory, file_name: &str, resolver: &PathResolver) -> PathBuf {
  let dir_path = match dir {
    BaseDirectory::AppLog => resolver.app_log_dir(),
    BaseDirectory::AppData => resolver.app_data_dir(),
    BaseDirectory::AppConfig => resolver.app_config_dir(),
    _ => None
  };

  let mut path_buf = if !DEBUG_MODE && dir_path != None {
    let path = dir_path.unwrap();
    if !path.exists() {
      create_dir_all(&path).expect(&format!("Error creating directory {:?}", path));
    }
    path
  } else {
    PathBuf::new()   
  };
  path_buf.push(file_name);
  path_buf
}