import { Modal, useModal, useToast } from "components/shared";
import { TaskForm } from "components/forms";
import { useTaskMutations } from "hooks";
import { Status } from "consts";

export const TASK_MODAL_ID = "task-dialog";

export function TaskModal() {
  const task = {
    id: 0,
    name: "",
    description: "",
    status: Status.IDLE,
    categoryId: 0,
    projectId: 0,
  };

  const { save, hide, opened } = useTaskModal();

  return (
    <>{opened ?
      <Modal opened={true}>
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
      </Modal> : null}</>
  );
}

function useTaskModal() {
  const { closeModal, isOpened } = useModal();
  const { success, error } = useToast();
  const { add } = useTaskMutations(
    () => {
      closeModal();
      success("Task added");
    },
    (err) => error(err)
  );

  return {
    hide: () => closeModal(),
    save: (data) => {
      data.projectId = +data.projectId;
      data.categoryId = +data.categoryId;
      add(data);
    },
    opened: isOpened(TASK_MODAL_ID)
  };
}
