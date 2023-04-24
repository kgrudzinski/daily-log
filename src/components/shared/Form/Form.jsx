import { useState } from "react";
import { FormProvider } from "./Context";
import { Field, FieldGroup, Control, Label } from "./Control";
import { FormAutocomplete } from "./FormAutocomplete";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Select, Option } from "./Select";
import { Checkbox } from "./Checkbox";
import { Radio } from "./Radio";
import { FormButton, FormIconButton } from "./Buttons";

export { FieldAlign } from ".";

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
    <form>
      <FormProvider data={context}>{children}</FormProvider>
    </form>
  );
}

Form.Field = Field;
Form.FieldGroup = FieldGroup;
Form.Control = Control;
Form.Label = Label;
Form.Input = Input;
Form.Textarea = Textarea;
Form.Select = Select;
Form.Autocomplete = FormAutocomplete;
Form.Option = Option;
Form.Checkbox = Checkbox;
Form.Radio = Radio;
Form.Button = FormButton;
Form.IconButton = FormIconButton;
