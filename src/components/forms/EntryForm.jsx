import { Form, ButtonColor } from "components/shared";
import { useTasks } from "hooks";

export function EntryForm({ data, onClose, onCancel }) {
  const { data: tasks, isLoading, isError, error } = useTasks();

  if (data.taskId === 0) {
    data.taskId = tasks && tasks.length > 0 ? tasks[0].id : 0;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>{error.message}</p>;
  }

  return (
    <Form initialData={data} onSubmit={onClose}>
      <Form.Field>
        <Form.Label>Task</Form.Label>
        <Form.Select name="taskId" expanded={1}>
          {tasks.map((it) => {
            return <Form.Option key={it.id} value={it.id} name={it.name} />;
          })}
        </Form.Select>
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
