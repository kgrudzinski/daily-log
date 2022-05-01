import { useState } from "react";
import { Card, IconButton, ButtonColor, Modal } from "components/shared";
import { TaskForm } from "components/forms";
import { useTaskMutations, useTasks } from "hooks";

export function ActiveTasks() {
  const { visible, show, hide, save, tasks } = useActiveTasks();

  return (
    <>
      <Card expand={true}>
        <Card.Header>
          <Card.Title title="Active tasks"></Card.Title>
          <Card.Icon></Card.Icon>
        </Card.Header>
        <Card.Content>
          <TaskTable data={tasks} />
        </Card.Content>
        <Card.Footer>
          <Card.FooterItem>
            <IconButton
              icon="fas fa-plus"
              color={ButtonColor.LINK_LIGHT}
              onClick={show}
            >
              Add task
            </IconButton>
          </Card.FooterItem>
        </Card.Footer>
      </Card>
      <FormModal visible={visible} hide={hide} save={save} />
    </>
  );
}

function TaskTable({ data }) {
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
        </tr>
      </thead>
      <tbody>
        {data.map((it) => {
          return (
            <tr key={it.id}>
              <td>{it.name}</td>
              <td>{it.projectId}</td>
              <td>{it.categoryId}</td>
            </tr>
          );
        })}
      </tbody>
      <tfooter></tfooter>
    </table>
  );
}

function FormModal({ visible, hide, save }) {
  const task = {
    id: 0,
    name: "",
    description: "",
    status: "Idle",
    categoryId: 0,
    projectId: 0,
  };
  return (
    <Modal opened={visible}>
      <div className="box">
        <TaskForm
          data={task}
          onCancel={hide}
          onClose={(data) => {
            save(data);
            hide();
          }}
        />
      </div>
    </Modal>
  );
}

function useActiveTasks() {
  const { data: tasks } = useTasks();
  const [formVisible, setFormVisible] = useState(false);

  const hideForm = () => setFormVisible(false);
  const saveForm = (data) => {
    console.log(data);
    add(data);
  };
  const showForm = () => setFormVisible(true);

  const { add } = useTaskMutations(hideForm, (err) => console.log(err));

  return {
    visible: formVisible,
    hide: hideForm,
    save: saveForm,
    show: showForm,
    tasks: tasks || [],
  };
}
