import "./tasks.scss";

export function TaskBoard({ tasks }) {
  const waiting = tasks.filter((it) => it.status === "Idle");
  const inProgress = tasks.filter((it) => it.status === "InProgress");
  const completed = tasks.filter((it) => it.status === "Complete");

  return (
    <div className="columns">
      <BoardColumn data={waiting} title="Waiting" />
      <BoardColumn data={inProgress} title="In progress" />
      <BoardColumn data={completed} title="Completed" />
    </div>
  );
}

function BoardColumn({ data, title }) {
  return (
    <div className="column is-one-third">
      <h4 className="title is-4 has-text-centered">{title}</h4>
      {data.map((it) => {
        return <BoardItem key={it.id} item={it} />;
      })}
    </div>
  );
}

function BoardItem({ item }) {
  return (
    <div className="board-item">
      {item.name}
      {item.projectName}
      {item.categoryName}
      <div className="item-details">{item.description}</div>
    </div>
  );
}
