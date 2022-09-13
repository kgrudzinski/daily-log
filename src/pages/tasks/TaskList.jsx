import { IconButton, Buttons } from "components/shared";
import "bulma-list/css/bulma-list.css";

export function TaskList({ tasks, operations }) {
  return (
    <ul className="list box">
      {tasks.map((it) => {
        return <ListItem key={it.id} data={it} operations={operations} />;
      })}
    </ul>
  );
}

function ListItem({ data, operations }) {
  const { onAddEntry, onComplete, onDelete, onEdit } = operations;
  return (
    <li className="list-item">
      <div className="list-item-content">
        <div className="list-item-title is-flex">
          <span className="task-name">{data.name}</span>
          <span
            className="tags ml-2"
            style={{ display: "inline-flex", position: "relative", right: 0 }}
          >
            <span className="tag is-link">{data.projectName}</span>
            <span className="tag is-primary">{data.categoryName}</span>
            <span className="tag is-info">{data.status}</span>
          </span>
        </div>
        <div className="list-item-description">{data.description}</div>
      </div>
      <div className="list-item-controls">
        <Buttons>
          <IconButton
            icon="fas fa-edit"
            title="Edit task"
            onClick={() => onEdit(data.id)}
          />
          <IconButton
            icon="fas fa-trash-alt"
            title="Delete task"
            onClick={() => onDelete(data.id)}
          />
          <IconButton
            icon="fas fa-plus"
            title="Add entry"
            onClick={() => onAddEntry(data.id)}
          />
          <IconButton
            icon="fas fa-check"
            title="Mark as completed"
            onClick={() => onComplete(data.id)}
            disabled={data.status === "Completed"}
          />
        </Buttons>
      </div>
    </li>
  );
}
