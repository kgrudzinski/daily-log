export function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map((it) => {
        return <ListItem key={it.id} data={it} />;
      })}
    </ul>
  );
}

function ListItem({ data }) {
  return (
    <li>
      <span>{data.name}</span>
      <span>{data.projectName}</span>
      <span>{data.categoryName}</span>
    </li>
  );
}
