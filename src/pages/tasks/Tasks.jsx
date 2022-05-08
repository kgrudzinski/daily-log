import { useState } from "react";
import { useTasks, useTaskMutations } from "hooks";
import {
  IconButton,
  ButtonColor,
  Message,
  useToast,
  Table,
} from "components/shared";
import { TaskForm } from "components/forms";

const Mode = {
  VIEW: "view",
  EDIT: "edit",
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
          <IconButton
            icon="fas fa-plus"
            color={ButtonColor.LINK_LIGHT}
            onClick={newTask}
          >
            Add task
          </IconButton>
          <TaskTable tasks={tasks} onEdit={editTask} onDelete={deleteTask} />
        </>
      ) : (
        <TaskDialog
          task={selected}
          onCancel={onFormCancel}
          onClose={onFormClose}
        />
      )}
    </>
  );
}

function TaskTable({ tasks, onEdit, onDelete }) {
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
      field: "categoryId",
      label: "Category",
    },
    {
      field: "projectId",
      label: "Project",
    },
    {
      field: "status",
      label: "Status",
    },
    {
      label: "Actions",
      render: (row) => {
        return <TaskControls id={row.id} onEdit={onEdit} onDelete={onDelete} />;
      },
    },
  ];

  if (tasks.length === 0) {
    return <p>No data to show</p>;
  }
  return <Table columns={columns} data={tasks} />;
}

function TaskControls({ id, onEdit, onDelete }) {
  return (
    <div>
      <IconButton icon="fas fa-edit" onClick={() => onEdit(id)} />
      <IconButton icon="fas fa-trash-alt" onClick={() => onDelete(id)} />
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

  const { data: tasks, status, error } = useTasks();
  const [mode, setMode] = useState(Mode.VIEW);
  const [selected, setSelected] = useState(null);

  const deleteTask = (id) => remove(id);
  const editTask = (id) => {
    setSelected(tasks.find((it) => it.id === id));
    setMode(Mode.EDIT);
  };

  const newTask = () => {
    setSelected(EmptyTask);
    setMode(Mode.EDIT);
  };

  const onFormClose = (data) => {
    data.categoryId = +data.categoryId;
    data.projectId = +data.projectId;

    console.log(data);

    if (data.id === 0) {
      add(data);
    } else {
      update(data);
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
    selected,
  };
}
