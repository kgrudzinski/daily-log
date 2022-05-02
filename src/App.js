import React from "react";
import { useEffect, useState } from "react";
import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { getCurrent } from "@tauri-apps/api/window";
//import { invoke } from "@tauri-apps/api/tauri";

import {
  //useQuery,
  //useMutation,
  //useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Pages, Page } from "components/shared";

import { AppMenu } from "components/layout/appmenu/AppMenu";

import { Start } from "./pages";

import { Settings } from "./pages/Settings";
import { Tasks } from "./pages/Tasks";
import { Configuration } from "./pages/Configuration";
import "./App.scss";
import "@fortawesome/fontawesome-free/js/all";

const AppPage = {
  HOME: "home",
  TASKS: "tasks",
  SETTINGS: "settings",
  CONFIGURATION: "configuration",
};

const AppMenuItems = [
  {
    id: AppPage.HOME,
    label: "Home",
    icon: "fas fa-home",
  },
  {
    id: AppPage.TASKS,
    label: "Tasks",
    icon: "fas fa-tasks",
  },
  {
    id: AppPage.CONFIGURATION,
    label: "Manage",
    icon: "fas fa-project-diagram",
  },
  {
    id: AppPage.SETTINGS,
    label: "Settings",
    icon: "fas fa-cog",
  },
];

const useApp = () => {
  const [appInfo, setAppInfo] = useState({
    name: "",
    version: "",
    tauriVersion: "",
  });

  const [dbinfo, setDbinfo] = useState({
    name: "",
    version: "",
  });

  const [appPage, setAppPage] = useState(AppPage.HOME);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const name = await getName();
      const version = await getVersion();
      const tauriVersion = await getTauriVersion();
      console.log(name, version, tauriVersion);
      setAppInfo({
        name,
        version,
        tauriVersion,
      });
    };

    getData();
  }, []);

  useEffect(() => {
    return getCurrent().listen("db-initialized", (event) => {
      console.log(event.payload);
      setDbinfo(event.payload);
    });
  }, []);

  const dispatch = (action) => {
    if (action.type === "change") {
      setAppPage(action.value);
    } else if (action.type === "action") {
      switch (action.name) {
        case "about":
          setShowModal(true);
          break;
        default:
      }
    }
  };

  return { appPage, showModal, setShowModal, dispatch, appInfo, dbinfo };
};

const queryClient = new QueryClient();

function App() {
  const { appPage, showModal, setShowModal, dispatch, appInfo, dbinfo } =
    useApp();

  /*
  const handleClick = () => {
    invoke("get_db_version");
    setShowModal(true);
  };
*/
  return (
    <div className="columns" style={{ height: "612px" }}>
      <div className="column is-2 pb-0">
        <AppMenu menu={AppMenuItems} selected={appPage} dispatch={dispatch} />
      </div>
      <div className="column is-10 pb-0">
        <QueryClientProvider client={queryClient}>
          <Pages selected={appPage}>
            <Page value={AppPage.HOME}>
              <Start></Start>
            </Page>
            <Page value={AppPage.TASKS}>
              <Tasks></Tasks>
            </Page>
            <Page value={AppPage.CONFIGURATION}>
              <Configuration></Configuration>
            </Page>
            <Page value={AppPage.SETTINGS}>
              <Settings></Settings>
            </Page>
          </Pages>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <Modal opened={showModal} onClose={() => setShowModal(false)}>
          <div className="box mt-1 mx-1">
            <p>App Name {appInfo.name}</p>
            <p>Version: {appInfo.version}</p>
            <p>Tauri version: {appInfo.tauriVersion}</p>
            <p>Database name: {dbinfo.name}</p>
            <p>Database version: {dbinfo.version}</p>
            <p>{appPage}</p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

function Modal({ opened, onClose, children }) {
  return (
    <div className={(opened ? "is-active " : "") + "modal"}>
      <div className="modal-background"></div>
      <div className="modal-content">{children}</div>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={onClose}
      ></button>
    </div>
  );
}

export default App;
