import React from "react";
import { useEffect, useState } from "react";
import { getName, getVersion, getTauriVersion } from "@tauri-apps/api/app";
import { getCurrent } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";

import {
  //useQuery,
  //useMutation,
  //useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import { Menu, MenuHeader, MenuItems, MenuItem, MenuFooter } from "components";

import {
  Pages,
  Page,
  Icon,
  IconText,
  IconButton,
  ButtonColor,
  ButtonSize,
} from "components/shared";

import { Start } from "./pages";

import { Settings } from "./pages/Settings";
import { Tasks } from "./pages/Tasks";
import { Configuration } from "./pages/Configuration";
import "./App.scss";
import "@fortawesome/fontawesome-free/js/all";

const AppPage = {
  HOME: "home",
  PROJECTS: "projects",
  SETTINGS: "settings",
  CONFIGURATION: "configuration",
};

const queryClient = new QueryClient();

function App() {
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

  const handleClick = () => {
    invoke("get_db_version");
    setShowModal(true);
  };

  return (
    <div className="columns" style={{ height: "612px" }}>
      <div className="column is-2 pb-0">
        <Menu selected={appPage} onChange={setAppPage}>
          <MenuHeader>Daily log</MenuHeader>
          <MenuItems>
            <MenuItem
              value={AppPage.HOME}
              label={
                <IconText>
                  <Icon icon="fas fa-home" />
                  <Icon.Text>Home</Icon.Text>
                </IconText>
              }
            />
            <MenuItem
              value={AppPage.TASKS}
              label={
                <IconText>
                  <Icon icon="fas fa-tasks" />
                  <Icon.Text>Tasks</Icon.Text>
                </IconText>
              }
            />
            <MenuItem
              value={AppPage.CONFIGURATION}
              label={
                <IconText>
                  <Icon icon="fas fa-project-diagram" />
                  <Icon.Text>Manage</Icon.Text>
                </IconText>
              }
            />
            <MenuItem
              value={AppPage.SETTINGS}
              label={
                <IconText>
                  <Icon icon="fas fa-cog" />
                  <Icon.Text>Settings</Icon.Text>
                </IconText>
              }
            />
          </MenuItems>

          <MenuFooter>
            <IconButton
              icon="fas fa-info"
              color={ButtonColor.LINK}
              onClick={handleClick}
              size={ButtonSize.NORMAL}
            >
              About
            </IconButton>
          </MenuFooter>
        </Menu>
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
