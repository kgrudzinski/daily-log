import { Modal, useModal, useModalData } from "components/shared";
import { EntryForm } from "components/forms";
import { RandService, DateService } from "services";

export function EntryModal() {
  const taskId = useModalData();

  const entry = {
    id: 0,
    taskId: taskId || 0,
    description: "",
    duration: 0,
    date: DateService.format(new Date()),
  };

  const { hide } = useEntryModal();

  return (
    <Modal id="entry_form">
      <div className="box">
        <EntryForm key={RandService.generateId()} data={entry} onClose={hide} />
      </div>
    </Modal>
  );
}

function useEntryModal() {
  const showModal = useModal();
  const hide = () => showModal("");

  return {
    hide,
  };
}
