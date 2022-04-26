import { Form, ButtonColor } from "components/shared";
import { useTasks } from "hooks";

export function EntryForm({ data, onClose, onCancel }) {
  const { data: tasks } = useTasks();

  return (
    <Form initialData={data} onSubmit={onClose}>
      <Form.Field>
        <Form.Label>Task</Form.Label>
        <Form.Select name="taskId">
          {tasks.map((it) => {
            return (
              <Form.Option
                key={it.id}
                value={it.id}
                Label={it.name}
                selected={it.id === data.taskId}
              />
            );
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
        <Form.Button color={ButtonColor.LINK_LIGHT}>Cancel</Form.Button>
      </Form.FieldGroup>
    </Form>
  );
}
