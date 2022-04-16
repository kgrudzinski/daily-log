import { Dashboard } from "./dashboard/Dashboard";

export function Start() {
  return (
    <article className="my-2 mr-2">
      <Dashboard>
        <Dashboard.Item>Test data</Dashboard.Item>
        <Dashboard.Item>Test data 2</Dashboard.Item>
        <Dashboard.Item>Test data 3</Dashboard.Item>
        <Dashboard.Item>Test data 4</Dashboard.Item>
      </Dashboard>
      <ActiveTasks></ActiveTasks>
      <Entries></Entries>
    </article>
  );
}

function ActiveTasks() {
  return <div>Active tasks</div>;
}

function Entries() {
  return <div>Today's entried</div>;
}
