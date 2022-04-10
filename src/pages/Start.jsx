export function Start() {
  return (
    <>
      <Dashboard></Dashboard>
      <ActiveTasks></ActiveTasks>
      <Entries></Entries>
    </>
  );
}

function Dashboard() {
  return <div>Dashboard</div>;
}

function ActiveTasks() {
  return <div>Active tasks</div>;
}

function Entries() {
  return <div>Today's entried</div>;
}
