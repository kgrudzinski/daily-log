import { createContext, useContext } from "react";

const EntryContext = createContext();

export function EntryProvider({ data, children }) {
  return <EntryContext.Provider value={data}>{children}</EntryContext.Provider>;
}

export function useEntryContext() {
  return useContext(EntryContext);
}
