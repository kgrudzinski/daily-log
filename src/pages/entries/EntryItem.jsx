import { DateService } from "services";
import "./entries.scss";

export function EntryItem({ item }) {
  console.log(item);
  const height = (item.duration / 5) * 10;
  const itemStyle = { height: `${height}px` };

  const time = DateService.formatTime(item.duration);

  return (
    <div style={itemStyle} className="item">
      <div>{item.task}</div>
      <div>{item.description}</div>
      <div>
        {time.h}:{time.m}
      </div>
    </div>
  );
}
