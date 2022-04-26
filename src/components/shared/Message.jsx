export function Message({ color, children }) {
  return <div className={`message ${color || "is-link"}`}>{children}</div>;
}

function Header({ children }) {
  return <div className="message-header">{children}</div>;
}

function Body({ children }) {
  return <div className="message-body">{children}</div>;
}

Message.Header = Header;
Message.Body = Body;
