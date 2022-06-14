import "./shared.scss";

export const ButtonSize = {
  SMALL: "is-small",
  NORMAL: "is-normal",
  MEDIUM: "is-medium",
  LARGE: "is-large",
};

export const ButtonColor = {
  PRIMARY: "is-primary",
  LINK: "is-link",
  INFO: "is-info",
  SUCCESS: "is-success",
  WARNING: "is-warning",
  DANGER: "is-danger",
  PRIMARY_LIGHT: "is-primary is-light",
  LINK_LIGHT: "is-link is-light",
  INFO_LIGHT: "is-info is-light",
  SUCCESS_LIGHT: "is-success is-light",
  WARNING_LIGHT: "is-warning is-light",
  DANGER_LIGHT: "is-danger is-light",
  WHITE: "is-white",
  LIGHT: "is-light",
  DARK: "is-dark",
  BLACK: "is-black",
  TEXT: "is-text",
  GHOST: "is-ghost",
};

export const ButtonAlign = {
  LEFT: "",
  CENTERED: "is-centered",
  RIGHT: "is-right",
};

const button_attrs = [
  "outlined",
  "rounded",
  "static",
  "selected",
  "loading",
  "fullwidth",
];

export function Button({ color, size, children, ...rest }) {
  const classes = ["button"];
  const props = [color, size];

  for (let prop of props) {
    if (prop) {
      classes.push(prop);
    }
  }

  for (let attr of button_attrs) {
    if (rest[attr]) {
      classes.push("is-" + attr);
    }
  }

  let other = {};
  for (let p in rest) {
    if (button_attrs.indexOf(p) === -1) {
      other[p] = rest[p];
    }
  }

  return (
    <button className={classes.join(" ")} {...other}>
      {children}
    </button>
  );
}

export function IconButton({
  icon,
  color,
  size,
  iconRight,
  children,
  ...rest
}) {
  const classes = ["button"];
  const props = [color, size];

  for (let prop of props) {
    if (prop) {
      classes.push(prop);
    }
  }

  for (let attr of button_attrs) {
    if (rest[attr]) {
      classes.push("is-" + attr);
    }
  }

  let other = {};
  for (let p in rest) {
    if (button_attrs.indexOf(p) === -1) {
      other[p] = rest[p];
    }
  }

  const icon_size = size || "";
  const text = children ? <span>{children}</span> : null;
  const icon_cmp = (
    <span className={`icon ${icon_size}`}>
      <i className={icon} />
    </span>
  );

  const content = iconRight ? (
    <>
      {text}
      {icon_cmp}
    </>
  ) : (
    <>
      {icon_cmp}
      {text}
    </>
  );

  return (
    <button className={classes.join(" ")} {...other}>
      {content}
    </button>
  );
}

export function Fab({ icon, tooltip, position, ...rest }) {
  return (
    <div className={`tooltip fab-${position}`}>
      <div className="tooltip-text">{tooltip}</div>
      <div className="fab-btn fab-icon" {...rest}>
        {/*children && <span className="tooltip">{children}</span>*/}
        <span>
          <i className={icon} />
        </span>
      </div>
    </div>
  );
}

export function Buttons(dense, align, children) {
  const classes = ["buttons"];
  if (dense) {
    classes.push("has-addons");
  }

  if (align) {
    classes.push(align);
  }

  return <div className={classes.join(" ")}>{children}</div>;
}

export function ButtonGroup({ dense, children }) {
  const classes = "field " + dense ? "has-addons" : "is-grouped";
  return (
    <div className={classes}>
      {children.map((it) => {
        return <div className="control">{it}</div>;
      })}
    </div>
  );
}
