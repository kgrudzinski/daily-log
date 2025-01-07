# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2025-01-07

### Features

- Entry form uses new  Autocomplete component for selecting tasks
- Searching and filtering tasks 
- Option to complete task from entry form
- Database backups

### Fixes

- Corrected notifications in EntryModal component
- Corrected icon alignment class names
- Fixed Button layout in app menu
- Fixed error showing Projects table

### Other

- Change application name from daily-log to Daily Log

## [0.3.1] 2023-03-20

### Fixes

- Correct html attribute
- Entries added from Tasks view are now visible in Entries view
- Bad notifications for data mutations

### Refactor

- Replace old code in Mnagement view

## [0.3.0] 2023-03-20

### Features

- Change parameter type of Datastore and Database open methods
- Add configuration and change location of application files

### Fixes

- Correct scrolling in task board view

## [0.2.0] 2023-01-16

### Features

- Replace fontawesome icons with material design icons
- Remove Status combobox form TaskForm
- Add Align enum
- Idle tasks are not allowed to be completed
- Add passing data to modals
- Entries can be edded from tasks table
- Toolbar rework
- Change styling of EntryItem in day view

### Fixes

- Fix invaliation of tasks query
- Adding entry also invalidates tasks query
- Fixed adding new task from start page
- Fixed content scrolling.
- Scrolled card content no longer overlaps card header

## [0.1.0] (Initial release) 2022-11-07

### Features

- Add and edit tasks
- Add and edit task entries
- Tasks can be grouped into projects
- Tasks can have category
- Task views:
  - list
  - table
  - board
- Entry wievs:
  - daily
  - weekly
  - monthly
