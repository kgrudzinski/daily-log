import { useFormContext } from "./Context";

export function useFormControl(control, value, changeFunc) {
  const { data, onChange } = useFormContext();
  if (data[control] !== undefined) {
    return { value: data[control], onChange: onChange };
  } else {
    return { value: value, onChange: changeFunc };
  }
}

const AttrTypes = [
  {
    name: "rounded",
    terget: "control",
    value: "is-rounded",
  },
  {
    name: "loading",
    target: "wrapper",
    value: "is-loading",
  },
  {
    name: "expanded",
    target: "wrapper",
    value: "is-expanded",
  },
  {
    name: "static",
    target: "control",
    value: "is-static",
  },
  {
    name: "leftIcon",
    target: "wrapper",
    value: "has-icons-left",
  },
  {
    name: "rightIcon",
    target: "wrapper",
    value: "has-icons-right",
  },
];

export function useControlStyles(type, data) {
  let control_classes = [type, data.color || "", data.size || ""];
  let wrapper_classes = ["control"];

  for (let attr of AttrTypes) {
    if (data[attr.name]) {
      if (attr.target === "wrapper") {
        wrapper_classes.push(attr.value);
      } else {
        control_classes.push(attr.value);
      }

      if (type === "select" && attr.name === "expanded") {
        control_classes.push("is-fullwidth");
      }
    }
  }

  return [control_classes.join(" "), wrapper_classes.join(" ")];
}

export function useFormSubmit() {
  const { onSubmit } = useFormContext();

  return onSubmit;
}
