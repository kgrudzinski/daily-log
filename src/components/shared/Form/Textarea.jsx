import { useFormControl, useControlStyles } from "./hooks";

export function Textarea(props) {
  const { value, onChange } = useFormControl(props.name);
  const [c_classes, w_classes] = useControlStyles("textarea", props);
  return (
    <div className={w_classes}>
      <textarea
        className={c_classes}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
