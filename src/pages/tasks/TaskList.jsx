import { TaskControls } from "./TaskControls";
import {
  Toolbar,
  SearchProvider,
  SearchInput,
  useSearch,
} from "components/shared";
import "bulma-list/css/bulma-list.css";
import "./tasks.scss";

/*
const FilterDefs = [
  { name: "projectName", label: "Project", type: "text"},
  { name: "categoryName", label: "Category", type: "text"},
  { name: "status", label: "Status", type: "text"}
];
*/

const SearchFields = ["name", "projectName", "categoryName", "status"];

export function TaskList({ tasks, operations }) {
  return (
    <SearchProvider searchFields={SearchFields}>
      <TaskListToolbar />
      <List items={tasks} operations={operations} />
    </SearchProvider>
  );
}

function TaskListToolbar() {
  return (
    <Toolbar classes="mb-0 toolbar pl-2 pr-2">
      <Toolbar.Left>
        <Toolbar.Item>
          <SearchInput name="taskSearch" placeholder="Search" />
        </Toolbar.Item>
      </Toolbar.Left>
    </Toolbar>
  );
}

//function FilterGroup({component, data})

function List({ items, operations }) {
  const { search } = useSearch();
  const results = search(items);

  return (
    <ul className="list box tasks-list ml-0">
      {results.map((it) => {
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
