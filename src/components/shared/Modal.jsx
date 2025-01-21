import { useState, useContext, createContext } from "react";

const ModalContext = createContext();

function useModalProvider() {
  const [modal, setModal] = useState({ id: "", data: null });

  const openModal = (id, data) => {
    setModal({ id: id, data: data });
  };

  const closeModal = () => {
    setModal({ id: "", data: null });
  }

  return {
    modal,
    openModal,
    closeModal
  };
}

export function ModalProvider({ children }) {
  const value = useModalProvider();
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const { openModal, closeModal, modal } = useContext(ModalContext);

  return { openModal, closeModal, isOpened: (id) => modal.id === id, data: modal.data };
}

export function useModalData() {
  const { modal } = useContext(ModalContext);

  return modal.data;
}

export function Modal({ opened, children }) {
  //const { opened } = useModalControl(id);

  const classes = "modal" + (opened ? " is-active" : "");
  return (
    <div className={classes}>
      <div className="modal-background"></div>
      <div className="modal-content">{children}</div>
    </div>
  );
}

export function ModalCard({ opened, children }) {
  //const { opened } = useModalControl(id);
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

function Close({ onClose }) {
  //const { showModal } = useModalControl("");
  return (
    <button
      className="modal-close is-large"
      aria-label="close"
      /*onClick={() => {
        showModal("");
      }}*/
      onClick={onClose}
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
