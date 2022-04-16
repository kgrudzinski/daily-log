//import { useQuery } from "react-query";

import { Card } from "../../../components/shared";
import "./dashboard.scss";

export function Dashboard({ children }) {
  return (
    <Card expand={true}>
      <Card.Header>
        <Card.Title title="Dashboard"></Card.Title>
        <Card.Icon></Card.Icon>
      </Card.Header>
      <Card.Content>
        <div className="container">{children}</div>
      </Card.Content>
    </Card>
  );
}

function Item({ children }) {
  return <div className="item">{children}</div>;
}

Dashboard.Item = Item;
