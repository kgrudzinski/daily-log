import { Tabs, Fab, Pages, Page, Message } from "components/shared";
import { EntryForm } from "components/forms";
import { useEntryPage, EntryTabs, Mode, Actions } from "./useEntryPage";
import { EntryProvider, useEntryContext } from "./Context";
import { DailyVew } from "./DayView";
import { WeekView } from "./WeekView";
import { MonthView } from "./MonthView";
import { Icons } from "consts";

export function Entries() {
  const {
    state,
    dispatch,
    entries,
    status,
    error,
    newEntry,
    changeTab,
    saveEntry,
    deleteEntry,
    editEntry,
  } = useEntryPage();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <ErrorMessage error={error.message} />;
  }

  const contextData = {
    saveEntry,
    deleteEntry,
    newEntry,
    editEntry,
    goToDay: (day) => {
      dispatch({
        type: Actions.CHANGE_TAB,
        tab: EntryTabs.DAY,
        date: day,
        refresh: true,
      });
    },
  };

  return (
    <EntryProvider data={contextData}>
      {state.mode === Mode.VIEW ? (
        <>
          <Tabs selected={state.tab} onChange={changeTab} key={state.token}>
            <Tabs.Tab id={EntryTabs.DAY}>Day</Tabs.Tab>
            <Tabs.Tab id={EntryTabs.WEEK}>Week</Tabs.Tab>
            <Tabs.Tab id={EntryTabs.MONTH}>Month</Tabs.Tab>
          </Tabs>

          <Pages selected={state.tab}>
            <Page value={EntryTabs.DAY}>
              <DailyVew date={state.date} entries={entries} />
            </Page>
            <Page value={EntryTabs.WEEK}>
              <WeekView date={state.date} entries={entries} />
            </Page>
            <Page value={EntryTabs.MONTH}>
              <MonthView date={state.date} entries={entries} />
            </Page>
          </Pages>

          <Fab
            icon={Icons.PLUS}
            position="bottom-right"
            tooltip="New entry "
            onClick={() => newEntry()}
          ></Fab>
        </>
      ) : (
        <EntryDialog data={state.selected} dispatch={dispatch} />
      )}
    </EntryProvider>
  );
}

function EntryDialog({ data, dispatch }) {
  const { onCancel, onClose } = useEntryDialog(dispatch);
  return (
    <div className="box">
      <EntryForm data={data} onClose={onClose} onCancel={onCancel} />
    </div>
  );
}

function useEntryDialog(dispatch) {
  const { saveEntry } = useEntryContext();

  const cancelDialog = () => {
    dispatch({ type: Actions.VIEW_MODE, mode: Mode.VIEW });
  };

  const closeDialog = (item) => {
    saveEntry(item);
    dispatch({ type: Actions.VIEW_MODE, mode: Mode.VIEW });
  };

  return {
    onCancel: cancelDialog,
    onClose: closeDialog,
  };
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
