import { useFormControl, useControlStyles } from "./hooks";

export function Select({ children, ...rest }) {
  const { value, onChange } = useFormControl(rest.name);
  const [c_classes, w_classes] = useControlStyles("select", rest);
  return (
    <div className={w_classes}>
      <div className={c_classes}>
        <select onChange={onChange} value={value} {...rest}>
          {children}
        </select>
      </div>
    </div>
  );
}

export function Option({ value, name }) {
  return <option value={value}>{name}</option>;
}
