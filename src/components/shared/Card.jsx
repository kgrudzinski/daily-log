import { useState, useContext, createContext } from "react";

const CardContext = createContext();

const useCard = () => {
  return useContext(CardContext);
};

export function Card({ expand, children }) {
  const [expanded, setExpanded] = useState(expand);
  return (
    <CardContext.Provider
      value={{ expanded: expanded, setExpanded: setExpanded }}
    >
      <div className="card">{children}</div>
    </CardContext.Provider>
  );
}

function Header({ children }) {
  return <header className="card-header">{children}</header>;
}

function Title({ title }) {
  return <p className="card-header-title">{title}</p>;
}

function Icon() {
  const { expanded, setExpanded } = useCard();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const iconClass = expanded ? "fas fa-angle-up" : "fas fa-angle-down";

  return (
    <button key={expanded} className="card-header-icon" onClick={handleClick}>
      <span className="icon">
        <i className={iconClass}></i>
      </span>
    </button>
  );
}

function Content({ children }) {
  const { expanded } = useCard();
  return expanded && <div className="card-content">{children}</div>;
}

function Image({ children }) {
  return <div className="card-image">{children}</div>;
}

function Footer({ children }) {
  const { expanded } = useCard();
  return expanded && <div className="card-footer">{children}</div>;
}

function FooterItem({ children }) {
  return <div className="card-footer-item">{children}</div>;
}

Card.Header = Header;
Card.Title = Title;
Card.Icon = Icon;
Card.Image = Image;
Card.Content = Content;
Card.Footer = Footer;
Card.FooterItem = FooterItem;
