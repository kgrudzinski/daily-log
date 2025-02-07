import { Modal, useModal } from "components/shared";

const ABOUT_DIALOG_ID = "about-dialog";

export function About({ appInfo, dbInfo }) {
  const { isOpened, closeModal } = useModal();
  const opened = isOpened(ABOUT_DIALOG_ID);

  return (
    <Modal opened={opened}>
      <div className="box mt-1 mx-1">
        <p>App Name {appInfo.name}</p>
        <p>Version: {appInfo.version}</p>
        <p>Tauri version: {appInfo.tauriVersion}</p>
        <p>Database name: {dbInfo.name}</p>
        <p>Database version: {dbInfo.version}</p>
        <Modal.Close onClose={closeModal} />
      </div>
    </Modal>
  );
}

export function useAboutDialog() {
  const { openModal } = useModal();
  return () => {
    openModal(ABOUT_DIALOG_ID);
  }
}