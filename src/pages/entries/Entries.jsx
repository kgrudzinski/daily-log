import { useState } from "react";
import { Tabs, Fab, useToast, Pages, Page, Message } from "components/shared";
import { EntryForm } from "components/forms";
import { useEntries, useEntryMutations } from "hooks";
import { DateService } from "services";
import { EntryProvider } from "./Context";
import { DailyVew } from "./DayView";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";

const Mode = {
  VIEW: "view",
  EDIT: "edit",
};

const EntryTabs = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
};

function useEntryPage() {
  const [mode, setMode] = useState(Mode.VIEW);
  const { success: successToast, error: errorToast } = useToast();
  const { add, update, remove } = useEntryMutations(
    () => {
      successToast("Entry added");
    },
    (err) => errorToast(err)
  );

  const { data: entries, status, error } = useEntries();
  const [tab, setTab] = useState(EntryTabs.DAY);
  const [selectedId, setSelectedId] = useState(-1);

  const newEntry = () => {
    setMode(Mode.EDIT);
  };

  const saveEntry = (data) => {
    data.taskId = +data.taskId;
    data.duration = +data.duration;
    data.date = DateService.fromString(data.date);
    if (data.id > 0) {
      update(data);
    } else {
      add(data);
    }
    setMode(Mode.VIEW);
  };

  const deleteEntry = (id) => {
    remove(id);
  };

  const onCancel = () => {
    setMode(Mode.VIEW);
  };

  return {
    mode,
    setMode,
    newEntry,
    entries,
    status,
    error,
    tab,
    setTab,
    selectedId,
    setSelectedId,
    saveEntry,
    deleteEntry,
    onCancel,
  };
}

export function Entries() {
  const {
    mode,
    setMode,
    newEntry,
    tab,
    setTab,
    entries,
    status,
    error,
    selectedId,
    setSelectedId,
    onCancel,
    saveEntry,
    deleteEntry,
  } = useEntryPage();

  const contextData = {
    setSelectedId,
    deleteEntry,
    setMode,
  };

  const selected =
    selectedId !== -1 && entries
      ? entries.find((it) => it.id === selectedId)
      : {
          id: 0,
          taskId: 0,
          date: DateService.format(new Date()),
          description: "",
          duration: 0,
        };

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <ErrorMessage error={error.message} />;
  }

  return (
    <>
      {mode === Mode.VIEW ? (
        <>
          <Tabs selected={tab} onChange={setTab}>
            <Tabs.Tab id={EntryTabs.DAY}>Day</Tabs.Tab>
            <Tabs.Tab id={EntryTabs.WEEK}>Week</Tabs.Tab>
            <Tabs.Tab id={EntryTabs.MONTH}>Month</Tabs.Tab>
          </Tabs>
          <EntryProvider data={contextData}>
            <Pages selected={tab}>
              <Page value={EntryTabs.DAY}>
                <DailyVew entries={entries} />
              </Page>
              <Page value={EntryTabs.WEEK}>
                <WeekView entries={entries} />
              </Page>
              <Page value={EntryTabs.MONTH}>
                <MonthView entries={entries} />
              </Page>
            </Pages>
          </EntryProvider>
          <Fab
            icon="fas fa-plus"
            position="bottom-right"
            tooltip="New entry "
            onClick={newEntry}
          ></Fab>
        </>
      ) : (
        <EntryDialog data={selected} onClose={saveEntry} onCancel={onCancel} />
      )}
    </>
  );
}

function EntryDialog({ data, onClose, onCancel }) {
  return (
    <div className="box">
      <EntryForm data={data} onClose={onClose} onCancel={onCancel} />
    </div>
  );
}

function ErrorMessage({ error }) {
  return (
    <Message color="is-danger">
      <Message.Header>
        <p>Error loading data</p>
      </Message.Header>
      <Message.Body>{error}</Message.Body>
    </Message>
  );
}
