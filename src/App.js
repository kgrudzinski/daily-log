import React from "react";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Pages, Page, useModal, Message } from "components/shared";
import { AppMenu, AppContent, About } from "components/layout";
import { Start, Tasks, Entries } from "./pages";
import { Settings } from "./pages/Settings";
import { Configuration } from "./pages/Configuration";
import { AppService } from "services";
import "./App.scss";
import "@fortawesome/fontawesome-free/js/all";

const AppPage = {
  HOME: "home",
  TASKS: "tasks",
  ENTRIES: "entries",
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
    id: AppPage.ENTRIES,
    label: "Entries",
    icon: "fas fa-file",
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

const AppState = {
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
};

const useApp = () => {
  const [appPage, setAppPage] = useState(AppPage.HOME);
  const [appState, setAppState] = useState(AppState.LOADING);
  const [appError, setAppError] = useState("");

  const showModal = useModal();

  const [appInfo, setAppInfo] = useState({
    name: "",
    version: "",
    tauriVersion: "",
  });

  const [dbinfo, setDbinfo] = useState({
    name: "",
    version: "",
  });

  useEffect(() => {
    const getAppInfo = async () => {
      setAppInfo(await AppService.getAppInfo());
    };
    getAppInfo();
  }, []);
  /*
  useEffect(() => {
    const getDbInfo = async () => {
      setDbinfo(await AppService.getDbInfo());
    };
    getDbInfo();
  }, []);
*/

  useEffect(() => {
    return AppService.listen("db-initialized", (event) => {
      setDbinfo(event.payload);
      setAppState(AppState.READY);
    });
  }, []);

  useEffect(() => {
    return AppService.listen("db-initialize-error", (event) => {
      console.log("Server Error", event.payload);
      setAppState(AppState.ERROR);
      setAppError(event.payload.message);
    });
  }, []);

  useEffect(() => {
    AppService.emit("frontend-ready");
  }, []);

  const dispatch = (action) => {
    if (action.type === "change") {
      setAppPage(action.value);
    } else if (action.type === "action") {
      switch (action.name) {
        case "about":
          AppService.getDbInfo();
          showModal("about");
          break;
        default:
      }
    }
  };

  return { appPage, dispatch, appInfo, dbinfo, appState, appError };
};

const queryClient = new QueryClient();

function App() {
  const { appPage, dispatch, appInfo, dbinfo, appState, appError } = useApp();

  if (appState === AppState.LOADING) {
    return <p>Loading...</p>;
  }

  if (appState === AppState.ERROR) {
    return (
      <Message color="is-danger">
        <Message.Header>Initialization error</Message.Header>
        <Message.Body>{appError}</Message.Body>
      </Message>
    );
  }

  return (
    <div className="columns" style={{ height: "782px" }}>
      <div className="column is-2 pb-0">
        <AppMenu menu={AppMenuItems} selected={appPage} dispatch={dispatch} />
      </div>
      <div className="column is-10 pb-0">
        <QueryClientProvider client={queryClient}>
          <AppContent>
            <Pages selected={appPage}>
              <Page value={AppPage.HOME}>
                <Start></Start>
              </Page>
              <Page value={AppPage.TASKS}>
                <Tasks></Tasks>
              </Page>
              <Page value={AppPage.ENTRIES}>
                <Entries />
              </Page>
              <Page value={AppPage.CONFIGURATION}>
                <Configuration></Configuration>
              </Page>
              <Page value={AppPage.SETTINGS}>
                <Settings></Settings>
              </Page>
            </Pages>
          </AppContent>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        <About appInfo={appInfo} dbInfo={dbinfo} />
      </div>
    </div>
  );
}

export default App;
