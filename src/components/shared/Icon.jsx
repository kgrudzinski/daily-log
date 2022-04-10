export const IconSize = {
  SMALL: "is-small",
  NORMAL: "is-normal",
  MEDIUM: "is-medium",
  LARGE: "is-large",
};

export const IconColor = {
  PRIMARY: "has-text-primary",
  LINk: "has-text-link",
  INFO: "has-text-info",
  SUCCESS: "has-text-success",
  WARNING: "has-text-warning",
  DANGER: "has-text-danger",
};

export function Icon({ icon, size, color, ...rest }) {
  const classes = ["icon"];
  if (size) {
    classes.push(size);
  }
  if (color) {
    classes.push(color);
  }

  return (
    <span className={classes.join(" ")} {...rest}>
      <i className={icon}></i>
    </span>
  );
}

function Text({ color, children, ...rest }) {
  return (
    <span className={color ? color : ""} {...rest}>
      {children}
    </span>
  );
}

Icon.Text = Text;

export function IconText({ component, color, children, ...rest }) {
  const classes = ["icon-text"];

  if (color) {
    classes.push(color);
  }

  const classNames = classes.join(" ");

  const ComponentName = component || "span";
  /*
  if (component === "div") {
    return <div className={classNames}>{children}</div>;
  } else {
    return <span className={classNames}>{children}</span>;
  }
  */
  return <ComponentName className={classNames}>{children}</ComponentName>;
}
