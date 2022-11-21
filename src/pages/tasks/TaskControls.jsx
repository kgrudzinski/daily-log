import { IconButton, Buttons, ButtonSize } from "components/shared";
import { Icons, Status } from "consts";

export function TaskControls({
  item,
  onEdit,
  onDelete,
  onAddEntry,
  onComplete,
  size,
  rounded,
  align,
}) {
  const _size = size || ButtonSize.NORMAL;
  return (
    <Buttons dense align={align}>
      <IconButton
        icon={Icons.EDIT}
        title="Edit task"
        size={_size}
        onClick={() => onEdit(item.id)}
        rounded={rounded}
      />
      <IconButton
        icon={Icons.DELETE}
        title="Delete task"
        onClick={() => onDelete(item.id)}
        size={_size}
        rounded={rounded}
      />
      <IconButton
        icon={Icons.PLUS}
        title="Add entry"
        onClick={() => onAddEntry(item.id)}
        size={_size}
        rounded={rounded}
      />
      <IconButton
        icon={Icons.CHECK}
        title="Mark as completed"
        onClick={() => onComplete(item.id)}
        disabled={item.status !== Status.IN_PROGRESS}
        size={_size}
        rounded={rounded}
      />
    </Buttons>
  );
}
