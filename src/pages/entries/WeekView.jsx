import { useState } from "react";
import { DateService } from "services";
import { Buttons, Button } from "components/shared";
//import { EntryItem } from "./EntryItem";
import "./entries.scss";

export function WeekView({ entries }) {
  const [weekStart, setWeekStart] = useState(
    DateService.getWeekStart(DateService.getCurrentDate())
  );
  const [year, weekNo] = DateService.getWeekNumber(weekStart);
  const weekEnd = DateService.addDays(weekStart, 6);

  const changeWeek = (dir) => {
    setWeekStart((d) => DateService.addDays(d, dir * 7));
  };

  const days = DateService.generateDays(weekStart, 7);

  const visibleEntries = entries.filter((it) => {
    const sts = DateService.toTimestamp(weekStart);
    const ets = DateService.toTimestamp(weekEnd);
    return it.date >= sts && it.date <= ets;
  });

  return (
    <div style={{ height: "90%", display: "flex", flexDirection: "column" }}>
      <div className="toolbar" style={{ flex: "0 1 auto" }}>
        <Buttons>
          <Button
            onClick={() => {
              changeWeek(-1);
            }}
          >
            &lt;
          </Button>
          <Button
            onClick={() => {
              setWeekStart(
                DateService.getWeekStart(DateService.getCurrentDate())
              );
            }}
          >
            Current Week
          </Button>
          <Button
            onClick={() => {
              changeWeek(1);
            }}
          >
            &gt;
          </Button>
        </Buttons>
        <div>
          Tydzień {weekNo}, {year}
        </div>
      </div>
      <div
        className="is-flex is-flex-direction-row is-justify-content-space-evenly"
        style={{ flex: "1 1 auto" }}
      >
        {days.map((day) => {
          return <DayView key={day} day={day} entries={visibleEntries} />;
        })}
      </div>
    </div>
  );
}

function DayView({ day, entries }) {
  const items = entries.filter(
    (it) => it.date === DateService.toTimestamp(day)
  );

  return (
    <div className="week-item">
      <div className="week-item-header">{DateService.format(day)}</div>
      <div>
        {items.map((it) => {
          return <Item key={it.id} item={it} />;
        })}
      </div>
    </div>
  );
}

function Item({ item }) {
  return <div className="week-entry">{item.task}</div>;
}
