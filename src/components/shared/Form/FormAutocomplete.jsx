import { Autocomplete } from "../Autocomplete";
import { useFormControl } from "./hooks";

export function FormAutocomplete(props) {
  const defIdFunc = (item) => item.id;
  const { value, onChange } = useFormControl(props.name);
  const getId = props.idFunc || defIdFunc;
  const item = props.items.find((it) => value === getId(it));
  return (
    <Autocomplete
      {...props}
      value={item}
      onChange={(item) => {
        onChange({ target: { name: props.name, value: item.id } });
      }}
    />
  );
}
