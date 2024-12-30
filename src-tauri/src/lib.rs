
pub mod database;
pub mod sql;
pub mod models;
pub mod commands;
pub mod datastore;
pub mod query;
pub mod mutations;

pub mod config;

use std::{
    fs::create_dir_all, 
    path::PathBuf,  
  };

use tauri::{
    PathResolver,
    api::path::BaseDirectory
};

#[cfg(debug_assertions)]
const DEBUG_MODE: bool = true;
#[cfg(not(debug_assertions))]
const DEBUG_MODE: bool = false;

pub fn create_app_dir(root: BaseDirectory, dirs: Option<&str>, resolver: &PathResolver) -> PathBuf {
    let root_path = match root {
        BaseDirectory::AppLog => resolver.app_log_dir(),
        BaseDirectory::AppData => resolver.app_data_dir(),
        BaseDirectory::AppConfig => resolver.app_config_dir(),
        _ => None
      };
    
      let mut path_buf = if !DEBUG_MODE && root_path != None {        
        root_path.unwrap()
      } else {
        PathBuf::new()   
      };
            
      if let Some(dir) = dirs {
        path_buf.push(dir);
      }

      if !path_buf.exists() {
        create_dir_all(&path_buf).expect(&format!("Error creating directory {:?}", path_buf));
      }

      path_buf
}

pub fn get_app_path(dir: BaseDirectory, file_name: &str, resolver: &PathResolver) -> PathBuf {
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