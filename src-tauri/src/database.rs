use rusqlite::{
    Connection,     
    Result as SqlResult,
    Error as SqlError,
    Row,
    Params,
};

use thiserror::Error;

use std::{
    sync::Mutex,
    path::Path
};
pub use rusqlite::params;

#[derive(Error, Debug)]
pub enum DbError {
    #[error("{0}")]
    Sql(#[from]SqlError),
    #[error("Database is not opened")]
    NoConnection
}

pub type DbResult<T> = Result<T, DbError>;

pub struct Database(Mutex<Option<Connection>>);

impl Database {
    pub fn new() -> Self {
        Self(Mutex::new(None))
    }

    pub fn open<P>(&self, db_file: P) -> DbResult<()> where P : AsRef<Path> {
        let mut inner = self.0.lock().unwrap();
        let opt = inner.take();
        if let Some(conn) = opt {
            let _ = conn.close();                      
        };
        let conn = Connection::open(db_file)?;
        *inner = Some(conn);
        Ok(())
    }

    pub fn close(&self) -> DbResult<()>  {
        let mut inner = self.0.lock().unwrap();
        let opt = inner.take();

        if let Some(conn) = opt {
            conn.close().map_err(|e| DbError::from(e.1))
        } else {
            Ok(())
        }          
    }

    pub fn execute<P: Params>(&self, cmd: &str, params: P) -> DbResult<usize> {
        log::debug!("executing command: {}", cmd);
        let inner = self.0.lock().unwrap();
        if let Some(conn) = &*inner {
            conn.execute(cmd, params).map_err(DbError::from)
        } else {
            Err(DbError::NoConnection)
        }
    }

    pub fn execute_script(&self, sql: &str) -> DbResult<()> {
        let mut inner = self.0.lock().unwrap();
        if let Some(ref mut conn) = &mut *inner {
            let trans = conn.transaction().map_err(DbError::from)?;
            trans.execute_batch(sql).map_err(DbError::from)?;
            trans.commit().map_err(DbError::from)
        } else {
            Err(DbError::NoConnection)
        }
    }

    pub fn query<P, F, T>(&self, query: &str, params: P, fun: F) -> DbResult<Vec<T>> where P: Params, F: FnMut(&Row<'_>) -> SqlResult<T> {
        log::debug!("executing query: {}", query);
        let inner = self.0.lock().unwrap();
        if let Some(conn) = &*inner {
            let mut res: Vec<T> = Vec::new();
            let mut stmt = conn.prepare(query)?;
            let res_iter = stmt.query_map(params, fun)?;            
            for item in res_iter {
                res.push(item.unwrap());
            }
            Ok(res)
        } else {
            Err(DbError::NoConnection)
        }
    }

    pub fn query_one<P, F, T>(&self, query: &str, params: P, f: F) -> DbResult<T> where P: Params, F: FnMut(&Row<'_>) -> SqlResult<T> {
        log::debug!("executing query: {}", query);
        let inner = self.0.lock().unwrap();
        if let Some(conn) = &*inner {
            conn.query_row(query, params, f).map_err(DbError::from)
        } else {
            Err(DbError::NoConnection)
        } 
    }

    pub fn get_last_rowid(&self) -> DbResult<i64> {
        let inner = self.0.lock().unwrap();
        if let Some(conn) = &*inner {
            Ok(conn.last_insert_rowid())
        } else {
            Err(DbError::NoConnection)
        }
    }    
}