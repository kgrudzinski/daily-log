import { useState } from "react";
import { useTasks, useTaskMutations, useEntryMutations } from "hooks";
import {
  IconButton,
  ButtonColor,
  Message,
  useToast,
  Table,
} from "components/shared";
import { EntryForm, TaskForm } from "components/forms";
import { DateService } from "services";
import "./tasks.scss";

const Mode = {
  VIEW: "view",
  EDIT: "edit",
  ADD_ENTRY: "add_entry",
};

const EmptyTask = {
  id: 0,
  name: "",
  description: "",
  projectId: 0,
  categoryId: 0,
  status: "Idle",
};

export function Tasks() {
  const {
    tasks,
    mode,
    status,
    error,
    onFormCancel,
    onFormClose,
    newTask,
    deleteTask,
    editTask,
    addEntry,
    completeTask,
    selected,
  } = useTasksView();

  console.log("render");

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <ErrorMessage error={error.message} />;
  }

  return (
    <>
      {mode === Mode.VIEW ? (
        <>
          <TaskTable
            tasks={tasks}
            onEdit={editTask}
            onDelete={deleteTask}
            onAddEntry={addEntry}
            onComplete={completeTask}
          />
          <IconButton
            icon="fas fa-plus"
            color={ButtonColor.LINK_LIGHT}
            onClick={newTask}
          >
            Add task
          </IconButton>
        </>
      ) : null}
      {mode === Mode.EDIT ? (
        <TaskDialog
          task={selected}
          onCancel={onFormCancel}
          onClose={onFormClose}
        />
      ) : null}
      {mode === Mode.ADD_ENTRY ? (
        <EntryDialog
          parentId={selected.id}
          onClose={onFormClose}
          onCancel={onFormCancel}
        />
      ) : null}
    </>
  );
}

function TaskTable({ tasks, onEdit, onDelete, onAddEntry, onComplete }) {
  const columns = [
    {
      field: "name",
      label: "Name",
    },
    {
      field: "description",
      label: "Description",
    },
    {
      field: "categoryName",
      label: "Category",
    },
    {
      field: "projectName",
      label: "Project",
    },
    {
      field: "status",
      label: "Status",
    },
    {
      label: "Actions",
      render: (row) => {
        return (
          <TaskControls
            row={row}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddEntry={onAddEntry}
            onComplete={onComplete}
          />
        );
      },
    },
  ];

  if (tasks.length === 0) {
    return <p>No data to show</p>;
  }
  return (
    <div className="mb-2 table-container">
      <Table columns={columns} data={tasks} />
    </div>
  );
}

function TaskControls({ row, onEdit, onDelete, onAddEntry, onComplete }) {
  return (
    <div>
      <IconButton
        icon="fas fa-edit"
        title="Edit task"
        onClick={() => onEdit(row.id)}
      />
      <IconButton
        icon="fas fa-trash-alt"
        title="Delete task"
        onClick={() => onDelete(row.id)}
      />
      <IconButton
        icon="fas fa-plus"
        title="Add entry"
        onClick={() => onAddEntry(row.id)}
      />
      <IconButton
        icon="fas fa-check"
        title="Mark as completed"
        onClick={() => onComplete(row.id)}
        disabled={row.status === "Completed"}
      />
    </div>
  );
}

function TaskDialog({ task, onClose, onCancel }) {
  return (
    <div className="box">
      <TaskForm data={task} onClose={onClose} onCancel={onCancel} />
    </div>
  );
}

function EntryDialog({ parentId, onClose, onCancel }) {
  const new_entry = {
    id: 0,
    taskId: parentId,
    date: DateService.format(new Date()),
    description: "",
    duration: 0,
  };
  return (
    <div className="box">
      <EntryForm data={new_entry} onClose={onClose} onCancel={onCancel} />
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <Message color="is-danger">
      <Message.Header>
        <p>Error loading data</p>
      </Message.Header>
      <Message.Body>{error}</Message.Body>
    </Message>
  );
}

function useTasksView() {
  const { success: successToast, error: errorToast } = useToast();
  const { add, update, remove } = useTaskMutations(
    () => {
      successToast("Task added");
    },
    (err) => errorToast(err)
  );

  const { add: addEntry } = useEntryMutations(
    () => {
      successToast("Entry added");
    },
    (err) => errorToast(err)
  );

  const { data: tasks, status, error } = useTasks();
  const [mode, setMode] = useState(Mode.VIEW);
  const [selected, setSelected] = useState(null);

  const deleteTask = (id) => remove(id);
  const editTask = (id) => {
    setSelected(tasks.find((it) => it.id === id));
    setMode(Mode.EDIT);
  };

  const addNewEntry = (id) => {
    setSelected(tasks.find((it) => it.id === id));
    setMode(Mode.ADD_ENTRY);
  };

  const completeTask = (id) => {
    const task = { ...tasks.find((it) => it.id === id), status: "Completed" };
    update(task);
  };

  const newTask = () => {
    setSelected(EmptyTask);
    setMode(Mode.EDIT);
  };

  const saveTask = (data) => {
    data.categoryId = +data.categoryId;
    data.projectId = +data.projectId;

    console.log(data);

    if (data.id === 0) {
      add(data);
    } else {
      update(data);
    }
  };

  const saveEntry = (data) => {
    data.taskId = +data.taskId;
    data.duration = +data.duration;
    data.date = DateService.fromString(data.date);
    addEntry(data);
  };

  const onFormClose = (data) => {
    console.log("onFormClose", mode, data);
    if (mode === Mode.EDIT) {
      saveTask(data);
    } else {
      saveEntry(data);
    }
    setMode(Mode.VIEW);
  };

  const onFormCancel = () => setMode(Mode.VIEW);

  return {
    mode,
    status,
    error,
    tasks,
    onFormClose,
    onFormCancel,
    newTask,
    editTask,
    deleteTask,
    addEntry: addNewEntry,
    completeTask,
    selected,
  };
}
