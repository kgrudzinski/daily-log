import { Form, ButtonColor } from "components/shared";

export function CategoryForm({ data, onClose, onCancel }) {
  return (
    <Form>
      <Form.Field initialData={data} onSubmit={onClose}>
        <Form.Label>Name</Form.Label>
        <Form.Input placeholder="name" name="name"></Form.Input>
        <Form.FieldGroup>
          <Form.Button submit color={ButtonColor.LINK}>
            Save
          </Form.Button>
          <Form.Button color={ButtonColor.LINK_LIGHT} onClick={onCancel}>
            Cancel
          </Form.Button>
        </Form.FieldGroup>
      </Form.Field>
    </Form>
  );
}
