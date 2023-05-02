import { useState, createContext, useContext } from "react";

const FilterContext = createContext();

export function FilterProvider({ children, caseSensitive = false }) {
  const data = useFilterProvider({ caseSensitive });

  return (
    <FilterContext.Provider value={data}>{children}</FilterContext.Provider>
  );
}

function useFilterProvider(options) {
  const [filters, setFilters] = useState({});

  const updateFilter = ({ name, value }) => {
    setFilters({ ...filters, [name]: value });
  };

  return {
    filters,
    updateFilter,
    options,
  };
}

export function useFilter() {
  const { options, filters } = useContext(FilterContext);

  const filterFunc = options.caseSensitive ? filterFuncCS : filterFuncCI;

  const applyFilter = (data) => {
    return data.filter((item) => {
      return filterItem(item, filters, filterFunc);
    });
  };

  return {
    applyFilter,
  };
}

export function useFilterControl() {
  const { filters, updateFilter } = useContext(FilterContext);
  return {
    filters,
    updateFilter,
  };
}

function filterItem(item, filters, filterFunc) {
  const res = [];
  for (let f in filters) {
    res.push(filterFunc(item[f], filters[f]));
  }

  return res.reduce((acc, curr) => acc && curr, true);
}

function filterFuncCS(value, filter) {
  return value.indexOf(filter) > -1;
}

function filterFuncCI(value, filter) {
  return value.toLowerCase().indexOf(filter.toLowerCase()) > -1;
}
