import { useState } from "react";
import { Form, ButtonColor, useToast } from "components/shared";
import { useTasks, useTaskMutations, useEntryMutations } from "hooks";
import { Status } from "consts";
import { DateService } from "services";

export function EntryForm({ data, onClose }) {
  const {
    tasks,
    isLoading,
    isError,
    error,
    showCompleted,
    setShowCompleted,
    setCompleteTask,
    completeTask,
    saveEntry,
  } = useEntryForm(data, onClose);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  const filteredItems = showCompleted
    ? tasks
    : tasks.filter((t) => t.status !== Status.COMPLETED);

  const taskFilterFunc = (val, it) => {
    const name = it.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
    const project =
      it.projectName.toLowerCase().indexOf(val.toLowerCase()) > -1;
    return name || project;
  };

  return (
    <Form initialData={data} onSubmit={saveEntry}>
      <Form.Field>
        <Form.Label>Task</Form.Label>
        <Form.Autocomplete
          name="taskId"
          items={filteredItems}
          filterFunc={taskFilterFunc}
          renderListItem={(it) => <TaskListItem item={it} />}
          placeholder="Select task"
        />
      </Form.Field>
      <Form.Field>
        <Form.Checkbox
          value={showCompleted}
          onChange={(evt) => setShowCompleted(evt.target.checked)}
        >
          Show completed tasks
        </Form.Checkbox>
      </Form.Field>
      <Form.Field>
        <Form.Label>Description</Form.Label>
        <Form.Textarea name="description" placeholder="description" />
      </Form.Field>
      <Form.Field>
        <Form.Label>Duration</Form.Label>
        <Form.Input type="number" name="duration" />
      </Form.Field>
      <Form.Field>
        <Form.Label>Date</Form.Label>
        <Form.Input type="date" name="date" />
      </Form.Field>
      <Form.Field>
        <Form.Checkbox
          value={completeTask}
          onChange={(evt) => setCompleteTask(evt.target.checked)}
        >
          Mark task as completed
        </Form.Checkbox>
      </Form.Field>
      <Form.FieldGroup>
        <Form.Button submit color={ButtonColor.LINK}>
          Save
        </Form.Button>
        <Form.Button color={ButtonColor.LINK_LIGHT} onClick={onClose}>
          Cancel
        </Form.Button>
      </Form.FieldGroup>
    </Form>
  );
}

function TaskListItem({ item }) {
  return (
    <>
      <div className="has-text-weight-bold is-size-7">
        <span className="mx-1">{item.projectName}</span>
        <span>{">"}</span>
        <span className="mx-1">{item.categoryName}</span>
        <span>{">"}</span>
        <span className="mx-1">{item.status}</span>
      </div>
      <div>{item.name}</div>
    </>
  );
}

function useEntryForm(data, onClose) {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const [showCompleted, setShowCompleted] = useState(isTaskCompleted(data.taskId, tasks));
  const [completeTask, setCompleteTask] = useState(false);

  const { success: successToast, error: errorToast } = useToast();

  const { add, update } = useEntryMutations();
  const { update: updateTask } = useTaskMutations();

  if (data.taskId === 0) {
    data.taskId = tasks && tasks.length > 0 ? tasks[0].id : 0;
  }

  const doCompleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    updateTask(
      { ...task, status: Status.COMPLETED },
      {
        onSuccess: () => {
          successToast("Task marked as completed");
        },
        onError: (err) => {
          errorToast(`Failed to complete task: ${err}`);
          console.log(err);
        },
        onSettled: () => {
          onClose();
        },
      }
    );
  };

  const onSettled = () => {
    if (!completeTask) {
      onClose();
    }
  };

  const onSuccess = (message, id) => {
    successToast(message);
    if (completeTask) {
      doCompleteTask(id);
    }
  };

  const saveEntry = (data) => {
    const toSave = {
      ...data,
      taskId: +data.taskId,
      duration: +data.duration,
      date: DateService.fromString(data.date),
    };

    if (toSave.id > 0) {
      update(toSave, {
        onSuccess: () => {
          onSuccess("Entry updated", toSave.taskId);
        },
        onError: (err) => errorToast(err),
        onSettled: onSettled,
      });
    } else {
      add(toSave, {
        onSuccess: () => {
          onSuccess("Entry added", toSave.taskId);
        },
        onError: (err) => errorToast(err),
        onSettled: onSettled,
      });
    }
  };

  return {
    tasks,
    isLoading,
    isError,
    error,
    showCompleted,
    setShowCompleted,
    setCompleteTask,
    completeTask,
    saveEntry,
  };
}

function isTaskCompleted(taskId, tasks) {
  if (!tasks) {
    return false;
  }

  const task = tasks.find(t => t.id === taskId);
  return task && task.status === Status.COMPLETED ? true : false;
}