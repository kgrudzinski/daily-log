import { Modal, useModal, useModalData } from "components/shared";
import { EntryForm } from "components/forms";
import { DateService } from "services";

export const ENTRY_MODAL_ID = "entry-dialog";

export function EntryModal() {

  const taskId = useModalData();
  const { closeModal, isOpened } = useModal();
  const opened = isOpened(ENTRY_MODAL_ID);

  const entry = {
    id: 0,
    taskId: taskId || 0,
    description: "",
    duration: 0,
    date: DateService.format(new Date()),
  };

  return (<>{opened ?
    <Modal opened={true}>
      <div className="box">
        <EntryForm data={entry} onClose={closeModal} />
      </div>
    </Modal> : null}
  </>);
}
