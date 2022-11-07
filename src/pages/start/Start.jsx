//import { Dashboard } from "./dashboard/Dashboard";
import { ActiveTasks } from "./ActiveTasks";
import { Entries } from "./Entries";

export function Start() {
  return (
    <article className="my-2 mr-2">
      {/*
      <section>
        <Dashboard>
          <Dashboard.Item>Test data</Dashboard.Item>
          <Dashboard.Item>Test data 2</Dashboard.Item>
          <Dashboard.Item>Test data 3</Dashboard.Item>
          <Dashboard.Item>Test data 4</Dashboard.Item>
        </Dashboard>
      </section>
  */}
      <section className="mt-4">
        <ActiveTasks></ActiveTasks>
      </section>
      <section className="mt-4">
        <Entries></Entries>
      </section>
    </article>
  );
}
