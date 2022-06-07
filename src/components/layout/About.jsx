import { Modal } from "components/shared";

export function About({ appInfo, dbInfo }) {
  //console.log("appInfo", appInfo);
  //console.log("dbinfo", dbInfo);
  return (
    <>
      <></>
      <Modal id="about">
        <div className="box mt-1 mx-1">
          <p>App Name {appInfo.name}</p>
          <p>Version: {appInfo.version}</p>
          <p>Tauri version: {appInfo.tauriVersion}</p>
          <p>Database name: {dbInfo.name}</p>
          <p>Database version: {dbInfo.version}</p>
          <Modal.Close />
        </div>
      </Modal>
    </>
  );
}
