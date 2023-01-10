import { useState } from "react";
import { DateService } from "services";
import { Toolbar, ButtonSize } from "components/shared";
import { useEntryContext } from "./Context";
import "./entries.scss";
import { Icons } from "consts";

export function MonthView({ date, entries }) {
  const [monthStart, setMonthStart] = useState(
    DateService.firstdayOfMonth(date)
  );
  const monthEnd = DateService.lastDayOfMonth(monthStart);

  const changeMonth = (dir) => {
    setMonthStart((val) => DateService.addMonths(val, dir * 1));
  };

  const weekStart = DateService.getWeekStart(monthStart);
  const days = DateService.generateDays(weekStart, 42);
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const visibleEntries = entries.filter((it) => {
    const sts = DateService.toTimestamp(monthStart);
    const ets = DateService.toTimestamp(monthEnd);
    return it.date >= sts && it.date <= ets;
  });

  return (
    <>
      <Toolbar classes="mb-1 toolbar pl-2 pr-2">
        <Toolbar.Left>
          <Toolbar.Button
            icon={Icons.CHEVRON_LEFT}
            size={ButtonSize.SMALL}
            onClick={() => {
              changeMonth(-1);
            }}
          />

          <Toolbar.Button
            size={ButtonSize.SMALL}
            onClick={() => {
              setMonthStart(DateService.firstdayOfMonth());
            }}
          >
            Current Month
          </Toolbar.Button>
          <Toolbar.Button
            icon={Icons.CHEVRON_RIGHT}
            size={ButtonSize.SMALL}
            onClick={() => {
              changeMonth(1);
            }}
          />

          <Toolbar.Item classes="ml-6">
            <p className="subtitle">
              {monthStart.getMonth() + 1}, {monthStart.getFullYear()}
            </p>
          </Toolbar.Item>
        </Toolbar.Left>
      </Toolbar>
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
      <div className="calendar-items">
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
