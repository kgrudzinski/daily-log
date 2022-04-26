export function Modal({ opened, closeButton, children }) {
  const classes = "modal" + (opened ? " is-active" : "");
  return (
    <div className={classes}>
      <div className="modal-background"></div>
      <div className="modal-content">{children}</div>
      {closeButton && (
        <button className="modal-close is-large" aria-label="close"></button>
      )}
    </div>
  );
}

export function ModalCard({ opened, children }) {
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
  return <button className="modal-close is-large" aria-label="close"></button>;
}

function Body({ children }) {
  return <section className="modal-card-body">{children}</section>;
}

function Footer({ children }) {
  return <footer className="modal-card-foot">{children}</footer>;
}

ModalCard.Header = Header;
ModalCard.Title = Title;
ModalCard.Close = Close;
ModalCard.Body = Body;
ModalCard.Footer = Footer;
