-- Initial database schema

CREATE TABLE Database (
    Name TEXT,
    Version INTEGER    
);

INSERT INTO Database(Name, Version) VALUES('Database', 1);

CREATE TABLE Status (
    StatusId INTEGER PRIMARY KEY,
    Name TEXT
);

INSERT INTO Status(Name) VALUES 
    ("Idle"),
    ("InProgress"),
    ("Completed");

CREATE TABLE Projects (
    ProjectId INTEGER PRIMARY KEY,
    Name TEXT NOT NULL,
    StatusId INTEGER NOT NULL,
    Description TEXT,
    FOREIGN KEY(StatusId) REFERENCES Status(StatusId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT
);

CREATE TABLE Category (
    CategoryId INTEGER PRIMARY KEY,
    Name TEXT NOT NULL
);

CREATE TABLE ProjectCategory (
    Id INTEGER PRIMARY KEY,
    ProjectId INTEGER,
    CategoryId INTEGER,
    FOREIGN KEY(ProjectId) REFERENCES Projects(ProjectId) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    FOREIGN KEY(CategoryId) REFERENCES Category(CategoryId) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);

CREATE TABLE Tasks (
    TaskId INTEGER PRIMARY KEY,
    ProjectId INTEGER NOT NULL,
    Name TEXT NOT NULL,
    Description TEXT,
    CategoryId INTEGER,
    StatusId INTEGER NOT NULL,    
    FOREIGN KEY(StatusId) REFERENCES Status(StatusId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT,
    FOREIGN KEY(ProjectId) REFERENCES Projects(ProjectId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT,
    FOREIGN KEY(CategoryId) REFERENCES Category(CategoryId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT
);

CREATE TABLE Entries (
    EntryId INTEGER PRIMARY KEY,
    TaskId INTEGER NOT NULL,
    Description TEXT,
    Duration INTEGER NOT NULL,
    Date INTEGER NOT NULL,
    FOREIGN KEY(TaskId) REFERENCES Tasks(TaskId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT
);

CREATE TRIGGER InsertEntry AFTER INSERT ON Entries
BEGIN
    UPDATE Tasks SET StatusId = 1 WHERE TaskId = New.TaskId;
    UPDATE Projects SET StatusId = 1 WHERE ProjectId = (Select ProjectId FROM Tasks WHERE TaskId = New.TaskId);
END;

CREATE VIEW IF NOT EXISTS TaskView AS 
SELECT 
    t.TaskId AS Id,
    t.Name AS Name, 
    t.Description AS DESCRIPTION, 
    t.CategoryId AS CategoryId, 
    c.Name AS CategoryName,
    t.StatusId AS Status,
    t.ProjectId AS ProjectId,
    p.Name AS ProjectName
FROM
    Tasks t,
    Projects p,
    Category c
WHERE
    t.CategoryId = c.CategoryId AND
    t.ProjectId = p.ProjectId;

/*
CREATE VIEW IF NOT EXISTS EntryView AS
SELECT
    e.EntryId AS Id
    e.Description AS Description,
    e.Duration AS Duration,
    e.TaskId AS TaskId,
    e.Date AS Date,
    t.Name as TaskName
FROM
    Entries e,
    Tasks t
WHERE
    t.TaskId = e.TaskId;
*/