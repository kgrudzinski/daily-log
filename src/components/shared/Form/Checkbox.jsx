import { useFormControl } from "./hooks";

export function Checkbox({ children, value, onChange, ...rest }) {
  const { value: _value, onChange: _onChange } = useFormControl(
    rest.name,
    value,
    onChange
  );
  return (
    <div className="control">
      <label className="checkbox">
        <input
          type="checkbox"
          checked={_value ? true : false}
          onChange={_onChange}
          {...rest}
          className="mr-1"
        />
        {children}
      </label>
    </div>
  );
}
