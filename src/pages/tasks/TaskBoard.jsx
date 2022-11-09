import { IconButton, Buttons, ButtonSize } from "components/shared";
import { Icons } from "consts";
import "./tasks.scss";

export function TaskBoard({ tasks, operations }) {
  const waiting = tasks.filter((it) => it.status === "Idle");
  const inProgress = tasks.filter((it) => it.status === "InProgress");
  const completed = tasks.filter((it) => it.status === "Complete");

  return (
    <div className="columns is-gapless">
      <BoardColumn data={waiting} title="Waiting" operations={operations} />
      <BoardColumn
        data={inProgress}
        title="In Progress"
        operations={operations}
      />
      <BoardColumn data={completed} title="Completed" operations={operations} />
    </div>
  );
}

function BoardColumn({ data, title, operations }) {
  return (
    <div className="column is-one-third">
      <div style={{ height: "100%", borderRight: "1px solid lightgray" }}>
        <h4 className="title is-4 has-text-centered">{title}</h4>
        {data.map((it) => {
          return <BoardItem key={it.id} item={it} operations={operations} />;
        })}
      </div>
    </div>
  );
}

function BoardItem({ item, operations }) {
  const { onAddEntry, onComplete, onDelete, onEdit } = operations;
  return (
    <div className="board-item">
      <div className="title is-5">{item.name}</div>
      <div className="tags">
        <span className="tag is-primary">{item.projectName}</span>
        <span className="tag is-link">{item.categoryName}</span>
      </div>
      <div className="item-details">
        <div className="subtitle is-6">{item.description}</div>
        <div>
          <Buttons dense align="is-right">
            <IconButton
              icon={Icons.EDIT}
              title="Edit task"
              size={ButtonSize.SMALL}
              onClick={() => onEdit(item.id)}
              rounded
            />
            <IconButton
              icon={Icons.DELETE}
              title="Delete task"
              size={ButtonSize.SMALL}
              onClick={() => onDelete(item.id)}
              rounded
            />
            <IconButton
              icon={Icons.PLUS}
              title="Add entry"
              size={ButtonSize.SMALL}
              onClick={() => onAddEntry(item.id)}
              rounded
            />
            <IconButton
              icon={Icons.CHECK}
              title="Mark as completed"
              size={ButtonSize.SMALL}
              onClick={() => onComplete(item.id)}
              disabled={item.status === "Completed"}
              rounded
            />
          </Buttons>
        </div>
      </div>
    </div>
  );
}
