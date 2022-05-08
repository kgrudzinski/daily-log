import { useState, useContext, createContext } from "react";

const ModalContext = createContext();

function useModalProvider() {
  const [opened, setOpened] = useState("");

  const showModal = (id) => {
    setOpened(id);
  };

  return {
    opened,
    showModal,
  };
}

export function ModalProvider({ children }) {
  const value = useModalProvider();
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const { showModal } = useContext(ModalContext);

  return showModal;
}

function useModalControl(id) {
  const { opened, showModal } = useContext(ModalContext);

  return {
    showModal,
    opened: opened === id,
  };
}

export function Modal({ id, children }) {
  const { opened } = useModalControl(id);

  const classes = "modal" + (opened ? " is-active" : "");
  return (
    <div className={classes}>
      <div className="modal-background"></div>
      <div className="modal-content">{children}</div>
    </div>
  );
}

export function ModalCard({ id, children }) {
  const { opened } = useModalControl(id);
  const classes = "modal" + (opened ? " is-active" : "");
  return (
    <div className={classes}>
      <div className="modal-background"></div>
      <div className="modal-card">{children}</div>
    </div>
  );
}

function Header({ children }) {
  return <header className="modal-card-head">{children}</header>;
}

function Title({ children }) {
  return <p className="modal-card-title">{children}</p>;
}

function Close() {
  const { showModal } = useModalControl("");
  return (
    <button
      className="modal-close is-large"
      aria-label="close"
      onClick={() => {
        showModal("");
      }}
    ></button>
  );
}

function Body({ children }) {
  return <section className="modal-card-body">{children}</section>;
}

function Footer({ children }) {
  return <footer className="modal-card-foot">{children}</footer>;
}

ModalCard.Header = Header;
ModalCard.Title = Title;
Modal.Close = Close;
ModalCard.Body = Body;
ModalCard.Footer = Footer;
