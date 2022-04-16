
use std::fmt;

#[derive(Default)]
struct RawDelete {
    table: String,
    where_: String
}

impl fmt::Display for RawDelete {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "DELETE FROM {}", self.table)?;
        if self.where_.len() > 0 {
            write!(f," WHERE {}", self.where_)?;
        }
        Ok(())
    }
}

#[derive(Default)]
struct RawInsert {
    table: String,
    columns: String,
    values: String
}

impl fmt::Display for RawInsert {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "INSERT INTO {}({}) VALUES({})", self.table, self.columns, self.values)
    }
}

#[derive(Default)]
struct RawUpdate {
    table: String,
    data: String,
    where_: String
}

impl fmt::Display for RawUpdate {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "UPDATE {} SET {}", self.table, self.data)?;
        if self.where_.len() > 0 {
            write!(f," WHERE {}", self.where_)?;
        }
        Ok(())
    }
}

pub struct DeleteFrom(RawDelete);
pub struct DeleteWhere(RawDelete);

pub struct Update(RawUpdate);

pub struct UpdateSet(RawUpdate);
pub struct UpdateWhere(RawUpdate);

pub struct Insert(RawInsert);
pub struct InsertInto(RawInsert);
pub struct FinalInsert(RawInsert);

impl DeleteFrom {
    pub fn where_(mut self, cond: &str) -> DeleteWhere {
        self.0.where_ = cond.to_string();
        DeleteWhere(self.0)
    }
}

impl fmt::Display for DeleteFrom {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl DeleteWhere {
    pub fn and(mut self, cond: &str) -> Self {
        self.0.where_.push_str(&format!(" AND {}", cond));
        self
    }

    pub fn or(mut self, cond: &str) -> Self {
        self.0.where_.push_str(&format!(" OR {}", cond));
        self
    }
}

impl fmt::Display for DeleteWhere {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl Insert {
    pub fn into(mut self, table: &str) -> InsertInto {
        self.0.table = table.to_string();
        InsertInto(self.0)
    }
}

impl InsertInto {
    pub fn values(mut self, values: &[&str]) -> FinalInsert {
        self.0.values = values.join(", ");
        FinalInsert(self.0)
    }
}

impl fmt::Display for FinalInsert {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl Update {
    pub fn set(mut self, data: &[(&str, &str)]) -> UpdateSet {
        self.0.data = data.iter().map(|it| format!("{} = {}",it.0, it.1)).collect::<Vec<String>>().join(", ");
        UpdateSet(self.0)
    }
}

impl UpdateSet {
    pub fn where_(mut self, cond: &str) -> UpdateWhere {
        self.0.where_ = cond.to_string();
        UpdateWhere(self.0)
    }
}

impl fmt::Display for UpdateSet {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl UpdateWhere {
    pub fn and(mut self, cond: &str) -> Self {
        self.0.where_.push_str(&format!(" AND {}", cond));
        self
    }

    pub fn or(mut self, cond: &str) -> Self {
        self.0.where_.push_str(&format!(" OR {}", cond));
        self
    }
}

impl fmt::Display for UpdateWhere {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

pub fn delete_from(table: &str) -> DeleteFrom {
    let delete = RawDelete{
        table: table.to_string(),
        ..Default::default()
    };

    DeleteFrom(delete)
}

pub fn insert(columns: &[&str]) -> Insert {
    Insert(RawInsert {
        columns: columns.join(", "),
        ..Default::default()
    })
}

pub fn update(table: &str) -> Update {
    Update(RawUpdate{
        table: table.to_string(),
        ..Default::default()
    })
}

#[cfg(test)]
mod test {
    use super::{delete_from, insert, update};

    #[test]
    fn delete_all() {
        let sql = delete_from("users").to_string();
        assert_eq!(sql, "DELETE FROM users");
    }

    #[test]
    fn delete_where() {
        let sql = delete_from("users").
        where_("userId = 4").
        to_string();
        assert_eq!(sql, "DELETE FROM users WHERE userId = 4");
    }

    #[test]
    fn delete_where_multi() {
        let sql = delete_from("users").
        where_("age < 16").
        and("age > 65").
        or("userId = 77").
        to_string();
        assert_eq!(sql, "DELETE FROM users WHERE age < 16 AND age > 65 OR userId = 77");
    }

    #[test]
    fn delete_with_subquery() {
        use crate::query::select;

        let sql = delete_from("comments").
        where_(&format!("userId IN ({})", select(&["userId"]).from("users").where_("banned = TRUE"))).
        to_string();

        assert_eq!(sql, "DELETE FROM comments WHERE userId IN (SELECT userId FROM users WHERE banned = TRUE)");
    }

    #[test]
    fn insert_item() {
        let sql = insert(&["login", "email", "passwd"]).
        into("users").
        values(&["'Winnie the pooh'", "'pooh@hundredacreforest.org'", "'honey!!!'"]).
        to_string();
        
        assert_eq!(sql, "INSERT INTO users(login, email, passwd) VALUES('Winnie the pooh', 'pooh@hundredacreforest.org', 'honey!!!')");
    }

    #[test]
    fn update_item() {
        let sql = update("users").                
        set(&[("login","'a'"), ("email", "'a@a'"), ("passwd", "'c'")]).
        where_("userId = 4").
        to_string();        
        assert_eq!(sql, "UPDATE users SET login = 'a', email = 'a@a', passwd = 'c' WHERE userId = 4");
    }

    #[test]
    fn update_item_where() {
        let sql = update("transactions").        
        set(&[("active", "0")]).
        where_("amount > 100").
        and("amount < 1000").
        or("customerId = 7").
        to_string();
        
        assert_eq!(sql, "UPDATE transactions SET active = 0 WHERE amount > 100 AND amount < 1000 OR customerId = 7");
    }


}