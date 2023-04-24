import { useFormControl, useControlStyles } from "./hooks";

export function Input(props) {
  const { value, onChange } = useFormControl(props.name);
  const [c_classes, w_classes] = useControlStyles("input", props);

  return (
    <div className={w_classes}>
      <input
        className={c_classes}
        type={props.text || "text"}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
