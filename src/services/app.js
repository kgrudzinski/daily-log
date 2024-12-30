import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/tauri";
import { getCurrent } from "@tauri-apps/api/window";
import { DateService } from "./dates";

export const AppService = {
  getAppInfo: async function () {
    const name = await getName();
    const version = await getVersion();
    const tauriVersion = await getTauriVersion();

    return {
      name,
      version,
      tauriVersion,
    };
  },

  getDbInfo: async function () {
    invoke("get_db_version");
  },

  requestBackup: async function (name) {
    console.log("name", name);
    invoke("backup_db", {
      filename: `${name}_${DateService.formatDateTime(new Date())}.sqlite`,
    });
  },

  listen: async function (event, callback) {
    return await getCurrent().listen(event, callback);
  },
  emit: function (event, params) {
    getCurrent().emit(event, params);
  },
};
