import { Table } from "components/shared";
import { TaskControls } from "./TaskControls";

export function TaskTable({ tasks, onEdit, onDelete, onAddEntry, onComplete }) {
  const columns = [
    {
      field: "name",
      label: "Name",
    },
    {
      field: "description",
      label: "Description",
    },
    {
      field: "categoryName",
      label: "Category",
    },
    {
      field: "projectName",
      label: "Project",
    },
    {
      field: "status",
      label: "Status",
    },
    {
      field: "",
      label: "Actions",
      render: (row) => {
        return (
          <TaskControls
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
    <div className="mb-2 table-container">
      <Table columns={columns} data={tasks} />
    </div>
  );
}
