use serde::{Serialize, Deserialize};
use serde_json;
use std::{
    error::Error,
    path::{Path, PathBuf},
    fs::File,
    io::BufReader,
    sync::{Mutex, MutexGuard}
};

#[derive(Debug)]
pub struct AppConfig {
    path: PathBuf,
    data: Mutex<ConfigData>
}

impl AppConfig {
    pub fn new<P: AsRef<Path>>(path : P) -> Self {
        let data = match ConfigData::from_file(&path) {
            Ok(d) => d,
            Err(e) => {
              log::error!("Error loading configuration file: {}", e);
              log::warn!("Creating default configuration");
              ConfigData::default()
            }
        };

        Self {
            path : path.as_ref().to_path_buf(),
            data: Mutex::new(data)
        }
    }

    pub fn data(&self) -> MutexGuard<ConfigData> {
        self.data.lock().unwrap()
    }

    pub fn save(&self) -> Result<(), Box<dyn Error>> {
        let data = self.data.lock().unwrap();
        data.save(&self.path)
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ConfigData {
    pub database: Option<String>,
    pub backup_dir: Option<String>
}

impl ConfigData {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn from_file<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn Error>> {
        let config = if path.as_ref().exists() {
            let fin = File::open(path)?;            
            let reader = BufReader::new(fin);
            serde_json::from_reader(reader)?
        } else {
            Self::default()
        };
        Ok(config)
    }

    pub fn load<P: AsRef<Path>>(&mut self, path: P) -> Result<(), Box<dyn Error>> {
        let fin = File::open(path)?;            
        let reader = BufReader::new(fin);
        let cfg: ConfigData = serde_json::from_reader(reader)?;
        self.database = cfg.database;
        Ok(())
    }

    pub fn save<P: AsRef<Path>>(&self, path: P) -> Result<(), Box<dyn Error>> {        
        let fout = File::create(path)?;
        serde_json::to_writer_pretty(fout, &self)?;        
        Ok(())
    }

    pub fn set_database<P: AsRef<Path>>(&mut self, path: P) {
        if let Some(p) = path.as_ref().to_str() {
            self.database = Some(p.to_owned());
        } else {
            log::error!("Database path contains non utf-8 characters");
        }        
    }

    pub fn set_backup_dir<P: AsRef<Path>>(&mut self, path: P) {
        if let Some(p) = path.as_ref().to_str() {
            self.backup_dir = Some(p.to_owned());
        } else {
            log::error!("backap dir path contains non utf-8 characters");
        }        
    }
}

#[cfg(test)]
mod tests {

    use super::ConfigData;
    const FILE_NAME: &str = "test_config.json";

    fn cleanup(filename: &str) {
        use std::path::Path;
        let exists = Path::new(filename).exists();
        if exists {
            let _ = std::fs::remove_file(filename);
        }
    }

    #[test]
    fn config() {
        let config = ConfigData {
            database: Some("database.db".to_string()),
            backup_dir: Some("backup".to_string())
        };

        config.save(FILE_NAME).expect("failed to save config file");
        let conf = ConfigData::from_file(FILE_NAME).expect("failed to load config file");
        assert_eq!(config.database, conf.database);
        assert_eq!(config.backup_dir, conf.backup_dir);
        cleanup(FILE_NAME);
    }
}