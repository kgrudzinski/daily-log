import { Table, ButtonSize, FilterProvider } from "components/shared";
import { TaskControls } from "./TaskControls";
import "./tasks.scss";

export function TaskTable({ tasks, onEdit, onDelete, onAddEntry, onComplete }) {
  const columns = [
    {
      field: "name",
      label: "Name",
      filterable: true,
    },
    /*
    {
      field: "description",
      label: "Description",
    },
    */
    {
      field: "categoryName",
      label: "Category",
      filterable: true,
    },
    {
      field: "projectName",
      label: "Project",
      filterable: true,
    },
    {
      field: "status",
      label: "Status",
      filterable: true,
    },
    {
      field: "",
      label: "Actions",
      render: (row) => {
        return (
          <TaskControls
            size={ButtonSize.SMALL}
            item={row}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddEntry={onAddEntry}
            onComplete={onComplete}
          />
        );
      },
    },
  ];

  if (tasks.length === 0) {
    return <p>No data to show</p>;
  }
  return (
    <div className="mb-2 tasks-table-container">
      <FilterProvider caseSensitive={false}>
        <Table columns={columns} data={tasks} filterRow={true} />
      </FilterProvider>
    </div>
  );
}
