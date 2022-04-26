import { Card, IconButton, ButtonColor } from "components/shared";

export function ActiveTasks() {
  return (
    <Card expand={true}>
      <Card.Header>
        <Card.Title title="Active tasks"></Card.Title>
        <Card.Icon></Card.Icon>
      </Card.Header>
      <Card.Content>
        <p>No data to show</p>
      </Card.Content>
      <Card.Footer>
        <Card.FooterItem>
          <IconButton icon="fas fa-plus" color={ButtonColor.LINK_LIGHT}>
            Add task
          </IconButton>
        </Card.FooterItem>
      </Card.Footer>
    </Card>
  );
}
