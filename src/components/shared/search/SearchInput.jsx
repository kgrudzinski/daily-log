import { useState } from "react";
import { Icons } from "consts/enums";
import { Icon, Form, IconButton, ButtonSize } from "components/shared/";
import { useSearchControl } from "./Search";

export function SearchInput({ width = "250px", ...rest }) {
  const { value, onChange, onKeyDown, clear } = useSearchInput();

  const style = {
    width: width,
  };

  return (
    <Form.FieldGroup>
      <Form.Control leftIcon rightIcon>
        <input
          {...rest}
          className="input is-small is-rounded"
          autoComplete="off"
          aria-autocomplete="none"
          style={style}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={value}
        ></input>
        <Icon icon={Icons.SEARCH} dir="is-left" />
      </Form.Control>
      <Form.Control>
        <IconButton
          disabled={value === ""}
          icon={Icons.CLOSE}
          size={ButtonSize.SMALL}
          onClick={clear}
          title="Clear search"
        ></IconButton>
      </Form.Control>
    </Form.FieldGroup>
  );
}

function useSearchInput() {
  const { updateSearch } = useSearchControl();

  const [value, setValue] = useState("");

  const onChange = (evt) => {
    setValue(evt.target.value);
  };

  const onKeyDown = (evt) => {
    if (evt.key === "Enter") {
      updateSearch(value);
    }
  };

  const clear = () => {
    setValue("");
    updateSearch("");
  };

  return {
    value,
    onChange,
    onKeyDown,
    clear,
  };
}
