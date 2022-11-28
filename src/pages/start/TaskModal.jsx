import { Modal, useModal, useToast } from "components/shared";
import { TaskForm } from "components/forms";
import { useTaskMutations } from "hooks";
import { RandService } from "services";
import { Status } from "consts";

export function TaskModal() {
  const task = {
    id: 0,
    name: "",
    description: "",
    status: Status.IDLE,
    categoryId: 0,
    projectId: 0,
  };

  const { save, hide } = useTaskModal();

  return (
    <Modal id="task_form">
      <div className="box">
        <TaskForm
          key={RandService.generateId()}
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

function useTaskModal() {
  const showModal = useModal();
  const { success, error } = useToast();
  const { add } = useTaskMutations(
    () => {
      showModal("");
      success("Task added");
    },
    (err) => error(err)
  );

  return {
    hide: () => showModal(""),
    save: (data) => {
      data.projectId = +data.projectId;
      data.categoryId = +data.categoryId;
      add(data);
    },
  };
}
