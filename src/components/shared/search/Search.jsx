import { useState, useContext, createContext } from "react";

const SearchContext = createContext();

export function SearchProvider({ children, searchFields = [] }) {
  const [searchStr, setSearchStr] = useState("");
  const value = {
    fields: searchFields,
    searchStr,
    update: setSearchStr,
  };
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearch() {
  const { fields: searchFields, searchStr } = useContext(SearchContext);

  const doSearch = (items) => {
    if (items.length === 0) {
      return [];
    }

    if (searchStr === "") {
      return items;
    }

    const fields =
      searchFields.length > 0 ? searchFields : Object.keys(items[0]);

    return items.filter((it) => checkItem(it, fields, searchStr));
  };

  return { search: doSearch };
}

export function useSearchControl() {
  const { update, searchStr } = useContext(SearchContext);

  return { updateSearch: update, searchStr };
}

function checkItem(item, fields, searchStr) {
  const res = [];

  for (let f of fields) {
    const val = item[f].toLowerCase();
    res.push(val.indexOf(searchStr.toLowerCase()) > -1);
  }

  return res.reduce((acc, curr) => acc || curr, false);
}
