import { useState } from "react";
import { useTasks, useTaskMutations, useEntryMutations } from "hooks";
import { Fab, Message, Tabs, Pages, Page, useToast } from "components/shared";
import { EntryForm, TaskForm } from "components/forms";
import { DateService } from "services";
import { TaskTable } from "./TaskTable";
import { TaskBoard } from "./TaskBoard";
import { TaskList } from "./TaskList";
import { Icons, Status } from "consts";
import "./tasks.scss";

const Mode = {
  VIEW: "view",
  EDIT: "edit",
  ADD_ENTRY: "add_entry",
};

const TaskTabs = {
  TABLE: "table",
  LIST: "list",
  BOARD: "board",
};

const EmptyTask = {
  id: 0,
  name: "",
  description: "",
  projectId: 0,
  categoryId: 0,
  status: Status.IDLE,
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
    tab,
    setTab,
  } = useTasksView();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <ErrorMessage error={error.message} />;
  }

  const operations = {
    onDelete: deleteTask,
    onEdit: editTask,
    onAddEntry: addEntry,
    onComplete: completeTask,
  };

  if (mode === Mode.VIEW) {
    return (
      <>
        <Tabs selected={tab} onChange={setTab}>
          <Tabs.Tab id={TaskTabs.TABLE}>Table</Tabs.Tab>
          <Tabs.Tab id={TaskTabs.BOARD}>Board</Tabs.Tab>
          <Tabs.Tab id={TaskTabs.LIST}>List</Tabs.Tab>
        </Tabs>
        <Pages selected={tab}>
          <Page value={TaskTabs.TABLE}>
            <TaskTable
              tasks={tasks}
              onEdit={editTask}
              onDelete={deleteTask}
              onAddEntry={addEntry}
              onComplete={completeTask}
            />
          </Page>
          <Page value={TaskTabs.BOARD}>
            <TaskBoard tasks={tasks} operations={operations} />
          </Page>
          <Page value={TaskTabs.LIST}>
            <TaskList tasks={tasks} operations={operations} />
          </Page>
        </Pages>
        <Fab
          icon={Icons.PLUS}
          position="bottom-right"
          tooltip="New task"
          onClick={newTask}
        ></Fab>
      </>
    );
  }
  if (mode === Mode.EDIT) {
    return (
      <TaskDialog
        task={selected}
        onCancel={onFormCancel}
        onClose={onFormClose}
      />
    );
  }

  if (mode === Mode.ADD_ENTRY) {
    return (
      <EntryDialog
        parentId={selected.id}
        onClose={onFormClose}
        onCancel={onFormCancel}
      />
    );
  }
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
  const { add, update, remove } = useTaskMutations();

  const { add: addEntry } = useEntryMutations(
    () => {
      successToast("Entry added");
    },
    (err) => errorToast(err)
  );

  const { data: tasks, status, error } = useTasks();
  const [mode, setMode] = useState(Mode.VIEW);
  const [tab, setTab] = useState(TaskTabs.TABLE);
  const [selected, setSelected] = useState(null);

  const deleteTask = (id) => {
    remove(id, {
      onSuccess: () => {
        successToast("Task deleted");
      },
      onError: (err) => errorToast(err),
    });
  };
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
    update(task, {
      onSuccess: () => {
        successToast("Task marked as completed");
      },
      onError: (err) => errorToast(err),
    });
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
      add(data, {
        onSuccess: () => {
          successToast("Task added");
        },
        onError: (err) => errorToast(err),
      });
    } else {
      update(data, {
        onSuccess: () => {
          successToast("Task updated");
        },
        onError: (err) => errorToast(err),
      });
    }
  };

  const saveEntry = (data) => {
    data.taskId = +data.taskId;
    data.duration = +data.duration;
    data.date = DateService.fromString(data.date);
    addEntry(data, {
      onSuccess: () => {
        successToast("Entry added");
      },
      onError: (err) => errorToast(err),
    });
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
    tab,
    setTab,
  };
}
