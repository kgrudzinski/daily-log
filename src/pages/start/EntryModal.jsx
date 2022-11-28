import { Modal, useModal, useModalData, useToast } from "components/shared";
import { EntryForm } from "components/forms";
import { useEntryMutations } from "hooks";
import { RandService, DateService } from "services";

export function EntryModal() {
  const taskId = useModalData();

  const entry = {
    id: 0,
    taskId: taskId,
    description: "",
    duration: 0,
    date: DateService.format(new Date()),
  };

  const { save, hide } = useEntryModal();

  return (
    <Modal id="entry_form">
      <div className="box">
        <EntryForm
          key={RandService.generateId()}
          data={entry}
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

function useEntryModal() {
  const showModal = useModal();
  const { success, error } = useToast();
  const { add } = useEntryMutations(
    () => {
      showModal("");
      success("Entry added");
    },
    (err) => error(err)
  );

  const hide = () => showModal("");

  return {
    hide,
    save: (data) => {
      const dataToSave = {
        ...data,
        duration: +data.duration,
        taskId: +data.taskId,
        date: DateService.fromString(data.date),
      };
      add(dataToSave);
    },
  };
}
