import { useContext, useState, createContext } from "react";

const TabsContext = createContext();

export function Tabs({ selected, onChange, children }) {
  const [selectedId, setSelectedId] = useState(selected);
  let classes = ["tabs"];

  const onTabClick = (id) => {
    setSelectedId(id);
    onChange(id);
  };

  const context = {
    selected: selectedId,
    onSelect: onTabClick,
  };

  return (
    <TabsContext.Provider value={context}>
      <div className={classes.join(" ")}>
        <ul>{children}</ul>
      </div>
    </TabsContext.Provider>
  );
}

function Tab({ children, id }) {
  const { isSelected, onSelect } = useTab(id);
  return (
    <li className={isSelected ? "is-active" : ""} onClick={() => onSelect(id)}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a>{children}</a>
    </li>
  );
}

function useTab(id) {
  const { selected, onSelect } = useContext(TabsContext);

  return {
    isSelected: selected === id,
    onSelect: onSelect,
  };
}

Tabs.Tab = Tab;
