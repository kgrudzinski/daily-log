import { TaskControls } from "./TaskControls";
import "bulma-list/css/bulma-list.css";
import "./tasks.scss";

export function TaskList({ tasks, operations }) {
  return (
    <ul className="list box tasks-list ml-0">
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
        <TaskControls
          item={data}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddEntry={onAddEntry}
          onComplete={onComplete}
        />
      </div>
    </li>
  );
}
