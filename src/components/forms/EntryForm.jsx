import { useState } from "react";
import { Form, ButtonColor } from "components/shared";
import { useTasks } from "hooks";
import { Status } from "consts";

export function EntryForm({ data, onClose, onCancel }) {
  const { data: tasks, isLoading, isError, error } = useTasks();
  const [showCompleted, setShowCompleted] = useState(false);

  if (data.taskId === 0) {
    data.taskId = tasks && tasks.length > 0 ? tasks[0].id : 0;
  }

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
    <Form initialData={data} onSubmit={onClose}>
      <Form.Field>
        <Form.Label>Task</Form.Label>
        <Form.Autocomplete
          name="taskId"
          items={filteredItems}
          filterFunc={taskFilterFunc}
          renderListItem={(it) => <TaskListItem item={it} />}
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
      <Form.FieldGroup>
        <Form.Button submit color={ButtonColor.LINK}>
          Save
        </Form.Button>
        <Form.Button color={ButtonColor.LINK_LIGHT} onClick={onCancel}>
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
