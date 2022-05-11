import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/tauri";

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
};
