import {
  Card,
  IconButton,
  ButtonColor,
  useModal,
  ButtonSize,
} from "components/shared";
import { useTasks } from "hooks";
import { Icons } from "consts";
import { TaskModal, TASK_MODAL_ID } from "./TaskModal";
import { ENTRY_MODAL_ID } from "./EntryModal";

export function ActiveTasks() {
  const { showTaskForm, showEntryForm, tasks } = useActiveTasks();
  const activeTasks = tasks.filter((it) => it.status === "InProgress");

  return (
    <>
      <Card expand={true}>
        <Card.Header>
          <Card.Title title="Active tasks"></Card.Title>
          <Card.Icon></Card.Icon>
        </Card.Header>
        <Card.Content sx={{ maxHeight: "225px", overflowY: "auto" }}>
          <TaskTable data={activeTasks} showEntryForm={showEntryForm} />
        </Card.Content>
        <Card.Footer>
          <Card.FooterItem>
            <IconButton
              icon={Icons.PLUS}
              color={ButtonColor.LINK_LIGHT}
              onClick={showTaskForm}
            >
              Add task
            </IconButton>
          </Card.FooterItem>
        </Card.Footer>
      </Card>
      <TaskModal />
    </>
  );
}

function TaskTable({ data, showEntryForm }) {
  if (!data.length || data.length === 0) {
    return <p>No data to show</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Project</th>
          <th>Category</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((it) => {
          return (
            <tr key={it.id}>
              <td>{it.name}</td>
              <td>{it.projectName}</td>
              <td>{it.categoryName}</td>
              <td>
                <IconButton
                  icon={Icons.PLUS}
                  size={ButtonSize.SMALL}
                  onClick={() => showEntryForm(it.id)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
      <tfoot></tfoot>
    </table>
  );
}

function useActiveTasks() {
  const { data: tasks } = useTasks();
  const { openModal } = useModal();

  const showTaskForm = () => {
    openModal(TASK_MODAL_ID);
  };

  const showEntryForm = (taskId) => {
    openModal(ENTRY_MODAL_ID, taskId);
  };

  return {
    showTaskForm,
    showEntryForm,
    tasks: tasks || [],
  };
}
