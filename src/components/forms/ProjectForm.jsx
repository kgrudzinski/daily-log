import { Form, ButtonColor } from "components/shared";

export function ProjectForm({ data, onClose, onCancel }) {
  return (
    <Form initialData={data} onSubmit={onClose}>
      <Form.Field>
        <Form.Label>Name</Form.Label>
        <Form.Input placeholder="Project name" name="name"></Form.Input>
      </Form.Field>
      <Form.Field>
        <Form.Label>Description</Form.Label>
        <Form.Textarea
          placeholder="Description"
          name="description"
        ></Form.Textarea>
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
