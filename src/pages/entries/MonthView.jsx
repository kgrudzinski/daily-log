import { useState } from "react";
import { DateService } from "services";
import { Buttons, Button } from "components/shared";
import { useEntryContext } from "./Context";
import "./entries.scss";

export function MonthView({ date, entries }) {
  const [monthStart, setMonthStart] = useState(
    DateService.firstdayOfMonth(date)
  );
  const monthEnd = DateService.lastDayOfMonth(monthStart);

  const changeMonth = (dir) => {
    setMonthStart((val) => DateService.addMonths(val, dir * 1));
  };

  const weekStart = DateService.getWeekStart(monthStart);
  const days = DateService.generateDays(weekStart, 35);
  const dayNames = ["Pon", "Wto", "Śro", "Czw", "Pią", "Sob", "Nie"];

  const visibleEntries = entries.filter((it) => {
    const sts = DateService.toTimestamp(monthStart);
    const ets = DateService.toTimestamp(monthEnd);
    return it.date >= sts && it.date <= ets;
  });

  return (
    <>
      <div className="toolbar">
        <Buttons>
          <Button
            onClick={() => {
              changeMonth(-1);
            }}
          >
            &lt;
          </Button>
          <Button
            onClick={() => {
              setMonthStart(DateService.firstdayOfMonth());
            }}
          >
            Current Month
          </Button>
          <Button
            onClick={() => {
              changeMonth(1);
            }}
          >
            &gt;
          </Button>
        </Buttons>
        <span>
          {monthStart.getMonth() + 1}, {monthStart.getFullYear()}
        </span>
      </div>
      <div className="calendar">
        {dayNames.map((day) => {
          return <DayHeader text={day} />;
        })}
        {days.map((day) => {
          return <DayView key={day} day={day} entries={visibleEntries} />;
        })}
      </div>
    </>
  );
}

function DayHeader({ text }) {
  return <div className="calendar-item-header">{text}</div>;
}

function DayView({ day, entries }) {
  const { goToDay } = useEntryContext();
  const ventries = entries.filter((it) => {
    return it.date === DateService.toTimestamp(day);
  });
  return (
    <div className="calendar-item">
      <div
        className="calendar-item-label"
        onClick={() => {
          goToDay(day);
        }}
      >
        {day.getDate()}
      </div>
      <div>
        {ventries.map((it) => {
          return <Item key={it.id} item={it} />;
        })}
      </div>
    </div>
  );
}

function Item({ item }) {
  const { editEntry } = useEntryContext();
  return (
    <div className="calendar-entry" onClick={() => editEntry(item)}>
      {item.task}
    </div>
  );
}
