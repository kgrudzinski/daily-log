import { useControlStyles } from "./hooks";

export function Field({ children }) {
  return <div className="field">{children}</div>;
}

export const FieldAlign = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

export function FieldGroup({
  align = FieldAlign.LEFT,
  multiline = false,
  dense = false,
  children,
}) {
  const classes = ["field", dense ? "has-addons" : "is-grouped"];

  if (align === FieldAlign.CENTER) {
    classes.push(dense ? "has-addons-centered" : "is-grouped-centered");
  } else if (align === FieldAlign.RIGHT) {
    classes.push(dense ? "has-addons-right" : "is-grouped-right");
  }

  if (multiline && !dense) {
    classes.push("is-grouped-multiline");
  }

  return <div className={classes.join(" ")}>{children}</div>;
}

export function Label({ children }) {
  return <label className="label">{children}</label>;
}

export function Control({ children, ...rest }) {
  const [, classes] = useControlStyles("control", rest);
  return <div className={classes}>{children}</div>;
}
