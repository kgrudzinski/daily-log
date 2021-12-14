
#[derive(Clone, Copy, Debug, serde::Serialize)]
pub enum Status {
    Idle,
    InProgress,
    Completed
}

#[derive(Debug, serde::Serialize)]
pub struct Project {
    id: u64,
    name: String,
    description: String,
    categories: Vec<u64>,
    status: Status
}

#[derive(Debug, serde::Serialize)]
pub struct Task {
    id: u64,
    name: String,
    description: String,
    category_id: u64,
    status: Status
}

#[derive(Debug, serde::Serialize)] 
pub struct Entry {
    id: u64,
    description: String,
    task_id: u64,
    duration: u64
}

#[derive(Debug, serde::Serialize)]
pub struct Category {
    id: u64,
    name: String
}