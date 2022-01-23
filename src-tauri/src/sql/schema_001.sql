-- Initial database schema

CREATE TABLE Database IF NOT EXISTS (
    Name TEXT,
    Version INTEGER    
);

INSERT INTO Database(Name, Version) VALUES('Database', 1);

CREATE TABLE Status IF NOT EXISTS (
    StatusId INTEGER PRIMARY KEY,
    Name TEXT
);

INSERT INTO Status(Name) VALUES 
    ("Idle"),
    ("InProgress"),
    ("Completed");

CREATE TABLE Project IF NOT EXISTS (
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

CREATE TABLE Tasks {
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
    FOREIGN KEY(CategoryId) REFERENCES Categories(CategoryId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT
};

CREATE TABLE Entries (
    EntryId INTEGER PRIMARY KEY,
    TaskId INTEGER NOT NULL,
    Description TEXT,
    Duration INTEGER NOT NULL,    
    FOREIGN KEY(TaskId) REFERENCES Tasks(TaskId) 
        ON DELETE RESTRICT 
        ON UPDATE RESTRICT
);
