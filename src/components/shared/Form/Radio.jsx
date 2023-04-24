import { useFormControl } from "./hooks";

export function Radio({ children, ...rest }) {
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
