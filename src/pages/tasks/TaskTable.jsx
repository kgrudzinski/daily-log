import { IconButton, Table } from "components/shared";
import { Icons } from "consts";

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
            row={row}
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

function TaskControls({ row, onEdit, onDelete, onAddEntry, onComplete }) {
  return (
    <div>
      <IconButton
        icon={Icons.EDIT}
        title="Edit task"
        onClick={() => onEdit(row.id)}
      />
      <IconButton
        icon={Icons.DELETE}
        title="Delete task"
        onClick={() => onDelete(row.id)}
      />
      <IconButton
        icon={Icons.PLUS}
        title="Add entry"
        onClick={() => onAddEntry(row.id)}
      />
      <IconButton
        icon={Icons.CHECK}
        title="Mark as completed"
        onClick={() => onComplete(row.id)}
        disabled={row.status === "Completed"}
      />
    </div>
  );
}
