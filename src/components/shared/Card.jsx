import { Icons } from "consts";
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
  return <header className="card-header mb-1">{children}</header>;
}

function Title({ title }) {
  return <p className="card-header-title">{title}</p>;
}

function Icon() {
  const { expanded, setExpanded } = useCard();

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const iconClass = expanded ? Icons.CHEVRON_UP : Icons.CHEVRON_DOWN;

  return (
    <button key={expanded} className="card-header-icon" onClick={handleClick}>
      <span className="icon">
        <i className={iconClass}></i>
      </span>
    </button>
  );
}

function Content({ children, sx }) {
  const { expanded } = useCard();
  return (
    expanded && (
      <div className="card-content" style={sx}>
        {children}
      </div>
    )
  );
}

function Image({ children }) {
  return <div className="card-image">{children}</div>;
}

function Footer({ children }) {
  const { expanded } = useCard();
  return expanded && <div className="card-footer">{children}</div>;
}

function FooterItem({ align, children }) {
  let flex_align;

  switch (align) {
    case "left":
      flex_align = "flex-start";
      break;
    case "right":
      flex_align = "flex-end";
      break;
    case "center":
      flex_align = "center";
      break;
    default:
      flex_align = "flex-start";
  }

  return (
    <span className="card-footer-item" style={{ justifyContent: flex_align }}>
      {children}
    </span>
  );
}

Card.Header = Header;
Card.Title = Title;
Card.Icon = Icon;
Card.Image = Image;
Card.Content = Content;
Card.Footer = Footer;
Card.FooterItem = FooterItem;
