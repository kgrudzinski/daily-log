import { useState, useContext, createContext } from "react";

const ModalContext = createContext();

function useModalProvider() {
  const [modal, setModal] = useState({ id: "", data: null });

  const showModal = (id, data) => {
    setModal({ id: id, data: data });
  };

  return {
    modal,
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

export function useModalData() {
  const { modal } = useContext(ModalContext);

  return modal.data;
}

function useModalControl(id) {
  const { modal, showModal } = useContext(ModalContext);

  return {
    showModal,
    opened: modal.id === id,
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
