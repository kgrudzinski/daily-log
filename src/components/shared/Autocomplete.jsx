import { React, useState } from "react";
import { Icons } from "consts";
import { IconButton } from ".";
import "./shared.scss";

export function Autocomplete({
  value,
  items,
  onChange,
  filterFunc,
  labelFunc = (item) => (item ? item.name : "-/-"),
  idFunc = (item) => item.id,
  width = "100%",
  renderListItem,
}) {
  const [input, setInput] = useState(labelFunc(value) || "");
  const [expanded, setExpanded] = useState(false);

  const filteredItems = items.filter((it) => {
    return filterFunc(input, it);
  });

  const expanded_cls = "dropdown is-active";
  const hidden_cls = "dropdown";

  const onSelectItem = (evt, item) => {
    evt.preventDefault();
    setInput(labelFunc(item));
    setExpanded(false);
    onChange(item);
  };

  const onInputChanged = (event) => {
    const v = event.target.value;
    setExpanded(true);
    setInput(v);
  };

  const expandList = (evt) => {
    evt.preventDefault();
    setExpanded(!expanded);
  };

  const style = {
    width: width,
  };

  const onKeyDown = (evt) => {
    if (evt.key === "Escape") {
      setExpanded(false);
      setInput(labelFunc(value));
    }
  };

  return (
    <div
      onBlur={() => setExpanded(false)}
      className={
        expanded && filteredItems.length > 0 ? expanded_cls : hidden_cls
      }
      style={style}
    >
      <div className="dropdown-trigger" style={style}>
        <div className="field has-addons">
          <div className="control" style={style}>
            <input
              className="input"
              type="text"
              value={input}
              onChange={onInputChanged}
              onKeyDown={onKeyDown}
            />
          </div>
          <div className="control">
            <IconButton
              icon={expanded ? Icons.CHEVRON_UP : Icons.CHEVRON_DOWN}
              disabled={filteredItems.length === 0}
              onClick={expandList}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      </div>
      <div className="dropdown-menu" style={style}>
        <div className="dropdown-content">
          {filteredItems.map((item, index) => {
            return (
              <div
                key={idFunc(item)}
                onClick={(evt) => onSelectItem(evt, item)}
                className="dropdown-item auto-item"
              >
                {renderListItem(item)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
