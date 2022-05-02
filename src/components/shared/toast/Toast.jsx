import { useState, useEffect, useContext, useRef, createContext } from "react";
import { createPortal } from "react-dom";
import "./toast.scss";

const ToastContext = createContext();

const ToastType = {
  ERROR: "error",
  SUCCESS: "success",
};

export function ToastProvider({
  position = "bottom-left",
  deleteTime,
  children,
}) {
  const { items, addToast, deleteToast } = useToastProvider();

  const value = {
    addToast,
    deleteToast,
    deleteTime,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className={"toast-container " + position}>
          {items.map((it) => {
            return <Toast key={it.id} data={it} />;
          })}
        </div>,
        document.getElementById("toaster")
      )}
    </ToastContext.Provider>
  );
}

function Toast({ data }) {
  const { classes, message, onDelete } = useToastItem(data);

  return (
    <div className={classes}>
      {message}
      <button className="delete is-small" onClick={onDelete} />
    </div>
  );
}

function useToastProvider() {
  const [items, setItems] = useState([]);
  const itemId = useRef(0);

  const addToast = (type, message) => {
    itemId.current += 1;
    setItems((current) => [...current, { type, message, id: itemId.current }]);
  };

  const deleteToast = (id) => {
    setItems((current) => current.filter((it) => it.id !== id));
  };

  return { items, addToast, deleteToast };
}

function useToastItem(data) {
  const { type, message, id } = data;
  const { deleteToast, deleteTime } = useContext(ToastContext);

  useEffect(() => {
    const timeoutId = deleteTime
      ? setTimeout(() => {
          deleteToast(id);
        }, deleteTime * 1000)
      : null;

    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  });

  const classes = `notification ${
    type === ToastType.ERROR ? "is-danger" : "is-link"
  }`;

  return {
    message,
    classes,
    onDelete: () => {
      deleteToast(id);
    },
  };
}

export function useToast() {
  const { addToast } = useContext(ToastContext);

  return {
    error: (message) => addToast(ToastType.ERROR, message),
    success: (message) => addToast(ToastType.SUCCESS, message),
  };
}
