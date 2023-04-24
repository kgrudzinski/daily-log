import { useFormSubmit } from "./hooks";
import { Button, IconButton } from "../Button";

export function FormButton({ submit, children, ...rest }) {
  const onSubmit = useFormSubmit();

  if (submit) {
    rest.onClick = (evt) => onSubmit(evt);
  }

  return (
    <div className="control">
      <Button type="button" {...rest}>
        {children}
      </Button>
    </div>
  );
}

export function FormIconButton({ submit, children, ...rest }) {
  const onSubmit = useFormSubmit();

  if (submit) {
    rest.onClick = (evt) => onSubmit(evt);
  }

  return (
    <div className="control">
      <IconButton type="button" {...rest}>
        {children}
      </IconButton>
    </div>
  );
}
