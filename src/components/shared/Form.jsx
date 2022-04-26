import { createContext, useContext, useState } from "react";
import { Button, IconButton } from "./Button";

const FormContext = createContext();

export function Form({ initialData, onSubmit, children }) {
  const [data, setData] = useState(initialData);

  const onValueChange = (evt) => {
    const newData = { ...data, [evt.target.name]: evt.target.value };
    setData(newData);
  };

  const context = {
    data: data,
    onChange: onValueChange,
    onSubmit: (evt) => {
      evt.preventDefault();
      onSubmit(data);
    },
  };

  return (
    <FormContext.Provider value={context}>
      <form>{children}</form>
    </FormContext.Provider>
  );
}

function Field({ children }) {
  return <div className="field">{children}</div>;
}

export const FieldAlign = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};

function FieldGroup({
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

function Label({ children }) {
  return <label className="label">{children}</label>;
}

function Control({ children }) {
  return <div className="control">{children}</div>;
}

function Input(props) {
  const { value, onChange } = useFormControl(props.name);

  return (
    <div className="control">
      <input
        className="input"
        type={props.text || "text"}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

function Textarea(props) {
  const { value, onChange } = useFormControl(props.name);

  return (
    <div className="control">
      <textarea
        className="textarea"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

function Select({ children, ...rest }) {
  const { value, onChange } = useFormControl(rest.name);
  return (
    <div className="control">
      <div className="select">
        <select onChange={onChange} value={value}>
          {children}
        </select>
      </div>
    </div>
  );
}

function Option({ value, name }) {
  return <option value={value}>{name}</option>;
}

function Checkbox({ children, ...rest }) {
  const { value, onChange } = useFormControl(rest.name);
  return (
    <div className="control">
      <label className="checkbox">
        <input
          type="checkbox"
          checked={value ? true : false}
          onChange={onChange}
          {...rest}
        />
        {children}
      </label>
    </div>
  );
}

function Radio({ children, ...rest }) {
  const { value, onChange } = useFormControl(rest.name);
  return (
    <label class="radio">
      <input
        type="radio"
        checked={value === rest.value}
        onChange={onChange}
        {...rest}
      />
      {children}
    </label>
  );
}

function FormButton({ submit, children, ...rest }) {
  const onSubmit = useFormSubmit();

  if (submit) {
    rest.onClick = (evt) => onSubmit(evt);
  }

  return (
    <div className="control">
      <Button {...rest}>{children}</Button>
    </div>
  );
}

function FormIconButton({ submit, children, rest }) {
  const onSubmit = useFormSubmit();

  if (submit) {
    rest.onClick = (evt) => onSubmit(evt);
  }

  return (
    <div className="control">
      <IconButton {...rest}>{children}</IconButton>
    </div>
  );
}

function useFormControl(control) {
  const { data, onChange } = useContext(FormContext);

  return { value: data[control], onChange: onChange };
}

function useFormSubmit() {
  const { onSubmit } = useContext(FormContext);

  return onSubmit;
}

Form.Field = Field;
Form.FieldGroup = FieldGroup;
Form.Control = Control;
Form.Label = Label;
Form.Input = Input;
Form.Textarea = Textarea;
Form.Select = Select;
Form.Option = Option;
Form.Checkbox = Checkbox;
Form.Radio = Radio;
Form.Button = FormButton;
Form.IconButton = FormIconButton;
