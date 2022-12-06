import { ButtonSize } from "components/shared";
import { Align, Status } from "consts";
import { TaskControls } from "./TaskControls";
import "./tasks.scss";

export function TaskBoard({ tasks, operations }) {
  const waiting = tasks.filter((it) => it.status === Status.IDLE);
  const inProgress = tasks.filter((it) => it.status === Status.IN_PROGRESS);
  const completed = tasks.filter((it) => it.status === Status.COMPLETED);

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
      <div
        style={{
          height: "100%",
          borderRight: "1px solid lightgray",
        }}
      >
        <h4 className="title is-4 has-text-centered">{title}</h4>
        <div
          style={{
            height: "calc(100% - 80px)",
            overflowY: "auto",
          }}
        >
          {data.map((it) => {
            return <BoardItem key={it.id} item={it} operations={operations} />;
          })}
        </div>
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
