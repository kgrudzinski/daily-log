import { createContext, useContext } from "react";

const FormContext = createContext();

export function FormProvider({ data, children }) {
  return <FormContext.Provider value={data}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  return useContext(FormContext);
}
