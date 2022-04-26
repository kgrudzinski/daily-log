import {
  Card,
  IconButton,
  ButtonColor,
  Icon,
  IconText,
} from "components/shared";

export function Entries() {
  return (
    <Card expand={true}>
      <Card.Header>
        <Card.Title
          title={
            <IconText>
              <Icon icon="fas fa-bars" />
              <Icon.Text>Today's entries</Icon.Text>
            </IconText>
          }
        ></Card.Title>
        <Card.Icon></Card.Icon>
      </Card.Header>
      <Card.Content>
        <p>No data to show</p>
      </Card.Content>
      <Card.Footer>
        <Card.FooterItem>
          <IconButton icon="fas fa-plus" color={ButtonColor.LINK_LIGHT}>
            Add Entry
          </IconButton>
        </Card.FooterItem>
      </Card.Footer>
    </Card>
  );
}
