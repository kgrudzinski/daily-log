import { useState } from "react";
import { DateService } from "services";
import { Buttons, Button } from "components/shared";
//import { EntryItem } from "./EntryItem";
import "./entries.scss";

export function MonthView({ entries }) {
  const [monthStart, setMonthStart] = useState(DateService.firstdayOfMonth());
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
      <div>
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
  return <div className="calendar-item">{day.getDate()}</div>;
}
