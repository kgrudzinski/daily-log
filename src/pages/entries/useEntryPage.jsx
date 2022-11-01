import { useReducer } from "react";
import { useEntries } from "hooks";
import { DateService, RandService } from "services";
import { useEntryMutations } from "hooks";
import { useToast } from "components/shared";

export const EntryTabs = {
  DAY: "day",
  WEEK: "week",
  MONTH: "month",
};

export const Mode = {
  VIEW: "view",
  EDIT: "edit",
};

export const Actions = {
  NEW_ENTRY: "new_entry",
  EDIT_ENTRY: "edit_entry",
  CHANGE_TAB: "change_tab",
  VIEW_MODE: "view_mode",
};

function dispatcher(state, action) {
  let newState;
  console.log(state);
  switch (action.type) {
    case Actions.VIEW_MODE:
      newState = { ...state, mode: Mode.VIEW };
      break;
    case Actions.NEW_ENTRY:
      newState = { ...state, mode: Mode.EDIT, selected: action.selected };
      break;
    case Actions.EDIT_ENTRY:
      newState = { ...state, mode: Mode.EDIT, selected: action.selected };
      break;
    case Actions.CHANGE_TAB:
      const tabToken = action.refresh ? RandService.generateId() : state.token;
      newState = {
        ...state,
        tab: action.tab,
        date: action.date || state.date,
        token: tabToken,
      };
      break;
    default:
      console.log("Unknown action", action.type);
  }
  return newState;
}

export function useEntryPage() {
  const initialState = {
    mode: Mode.VIEW,
    tab: EntryTabs.DAY,
    date: DateService.getCurrentDate(),
    selected: null,
    token: "asdsa", //passed to a key property of Tabs componenet to force rerender when changing tabs from JS
  };

  const { data: entries, status, error } = useEntries();
  const { success: successToast, error: errorToast } = useToast();
  const { add, update, remove } = useEntryMutations(
    () => {
      successToast("Entry added");
    },
    (err) => errorToast(err)
  );
  const [state, dispatch] = useReducer(dispatcher, initialState);

  const changeTab = (tab) => dispatch({ type: Actions.CHANGE_TAB, tab: tab });
  const newEntry = (date) => {
    const item = {
      id: 0,
      taskId: 0,
      date: DateService.format(date || DateService.getCurrentDate()),
      description: "",
      duration: 0,
    };
    dispatch({
      type: Actions.NEW_ENTRY,
      selected: item,
    });
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
  };

  const deleteEntry = (id) => {
    remove(id);
  };

  const editEntry = (item) => {
    const selected = { ...item, date: DateService.formatTimestamp(item.date) };
    dispatch({ type: Actions.EDIT_ENTRY, selected: selected });
  };

  return {
    state,
    entries,
    status,
    error,
    dispatch,
    changeTab,
    newEntry,
    editEntry,
    saveEntry,
    deleteEntry,
  };
}
