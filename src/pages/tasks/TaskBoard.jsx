import { ButtonSize } from "components/shared";
import { Align, Status } from "consts";
import { TaskControls } from "./TaskControls";
import "./tasks.scss";

export function TaskBoard({ tasks, operations }) {
  const waiting = tasks.filter((it) => it.status === Status.IDLE);
  const inProgress = tasks.filter((it) => it.status === Status.IN_PROGRESS);
  const completed = tasks.filter((it) => it.status === Status.COMPLETED);

  return (
    <div className="columns is-gapless" style={{ height: "100%" }}>
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
      <div className="board-column">
        <header className="is-size-4 has-text-centered mb-0">{title}</header>
        <article>
          {data.map((it) => {
            return <BoardItem key={it.id} item={it} operations={operations} />;
          })}
        </article>
      </div>
    </div>
  );
}

function BoardItem({ item, operations }) {
  const { onAddEntry, onComplete, onDelete, onEdit } = operations;
  return (
    <div className="board-item">
      <div className="title is-6">{item.name}</div>
      <div className="tags">
        <span className="tag is-primary has-text-white">{item.projectName}</span>
        <span className="tag is-link">{item.categoryName}</span>
      </div>
      <div className="item-details">
        <div className="subtitle is-6">{item.description}</div>
        <div>
          <TaskControls
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddEntry={onAddEntry}
            onComplete={onComplete}
            size={ButtonSize.SMALL}
            rounded
            align={Align.RIGHT}
          />
        </div>
      </div>
    </div>
  );
}
