import { useContext, useReducer, createContext } from "react";
import "bulma-list/sass/bulma-list.sass";

const ListActionType = {
  CLEAR: "clear",
  TOGGLE: "toggle",
  CHANGE: "change",
};

const ListItemMode = {
  VIEW: "view",
  EDIT: "edit",
};

const ListContext = createContext();

export function List({ operations, children }) {
  return (
    <ListContext.Provider value={operations}>
      <ul className="list has-visible-pointer-controls">{children}</ul>
    </ListContext.Provider>
  );
}

const useListItem = (initValue) => {
  const listReducer = (state, action) => {
    let newState;
    switch (action.type) {
      case ListActionType.CLEAR:
        newState = { ...state, value: "" };
        break;
      case ListActionType.TOGGLE:
        newState = { ...state, mode: action.mode };
        break;
      case ListActionType.CHANGE:
        newState = { ...state, value: action.value };
        break;
      default:
        console.log("Unknown action: ", action.type);
        newState = { ...state };
    }
    console.log("newState", newState);
    return newState;
  };

  return useReducer(listReducer, {
    value: initValue,
    mode: ListItemMode.VIEW,
  });
};

function ListItem({ value, id }) {
  const [state, dispatch] = useListItem(value);
  const { update, remove } = useContext(ListContext);

  const onValueChange = (evt) => {
    dispatch({ type: ListActionType.CHANGE, value: evt.target.value });
  };

  const onCancelClicked = () => {
    dispatch({ type: ListActionType.TOGGLE, mode: ListItemMode.VIEW });
  };

  const onAcceptClicked = () => {
    update(id, state.value);
    dispatch({ type: ListActionType.TOGGLE, mode: ListItemMode.VIEW });
  };

  const onRemoveClicked = () => {
    remove(id);
  };

  const onEditClicked = () => {
    dispatch({
      type: ListActionType.TOGGLE,
      mode: ListItemMode.EDIT,
    });
  };

  if (state.mode === ListItemMode.VIEW)
    return (
      <ListViewItem
        value={state.value}
        onEdit={onEditClicked}
        onRemove={onRemoveClicked}
      />
    );
  else
    return (
      <ListEditItem
        value={state.value}
        onChange={onValueChange}
        onAccept={onAcceptClicked}
        onCancel={onCancelClicked}
      />
    );
}

function ListViewItem({ value, onEdit, onRemove }) {
  return (
    <li className="list-item">
      <div className="list-item-content">
        <div className="list-item-title">{value}</div>
      </div>
      <div className="list-item-controls">
        <div className="buttons is-right">
          <button className="button" onClick={onEdit}>
            <span className="icon">
              <i className="fas fa-edit"></i>
            </span>
          </button>
          <button className="button" onClick={onRemove}>
            <span className="icon">
              <i className="fas fa-trash-alt"></i>
            </span>
          </button>
        </div>
      </div>
    </li>
  );
}

function ListEditItem({ value, onChange, onAccept, onCancel }) {
  return (
    <li className="list-item">
      <div className="list-item-content">
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              value={value}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className="list-item-controls">
        <div className="buttons is-right">
          <button className="button" onClick={onAccept}>
            <span className="icon">
              <i className="fas fa-check"></i>
            </span>
          </button>
          <button className="button" onClick={onCancel}>
            <span className="icon">
              <i className="fas fa-times-circle"></i>
            </span>
          </button>
        </div>
      </div>
    </li>
  );
}

function ListNewItem() {
  const { add } = useContext(ListContext);
  const [state, dispatch] = useListItem("");

  const onAddClicked = () => {
    add(state.value);
    dispatch({
      type: ListActionType.CLEAR,
    });
  };

  return (
    <li className="list-item">
      <div className="list-item-content">
        <div className="field">
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="New item"
              value={state.value}
              onChange={(evt) =>
                dispatch({
                  type: ListActionType.CHANGE,
                  value: evt.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
      <div className="list-item-controls">
        <div className="buttons is-right">
          <button className="button" onClick={() => onAddClicked()}>
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
          </button>
        </div>
      </div>
    </li>
  );
}

List.Item = ListItem;
List.NewItem = ListNewItem;
