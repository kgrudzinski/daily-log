import { useEntryContext } from "./Context";
import { DateService } from "services";
import "./entries.scss";

export function EntryItem({ item }) {
  const { editEntry } = useEntryContext();
  const time = DateService.formatTime(item.duration);

  return (
    <div
      className="entry-item"
      onClick={() => {
        editEntry(item);
      }}
    >
      <div className="entry-item-header">
        <span className="title is-5">{item.task}</span>
        <span className="title is-5">
          {time.h}:{time.m}
        </span>
      </div>
      <div>{item.description}</div>
    </div>
  );
}
