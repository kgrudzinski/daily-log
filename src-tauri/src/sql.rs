
const SCHEMA_VERSION_001: &str = include_str!("sql/schema_001.sql");

pub fn get_schemas() -> Vec<&'static str> {
    vec![SCHEMA_VERSION_001]
}