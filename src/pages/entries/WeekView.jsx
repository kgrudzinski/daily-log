import { useState } from "react";
import { DateService } from "services";
import { Toolbar, ButtonSize } from "components/shared";
import { useEntryContext } from "./Context";
import "./entries.scss";
import { Icons } from "consts";

export function WeekView({ date, entries }) {
  const [weekStart, setWeekStart] = useState(
    DateService.getWeekStart(date || DateService.getCurrentDate())
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
    </*style={{ height: "90%", display: "flex", flexDirection: "column" }}*/>
      <Toolbar classes="mb-1 toolbar pl-2 pr-2">
        <Toolbar.Left>
          <Toolbar.Button
            icon={Icons.CHEVRON_LEFT}
            size={ButtonSize.SMALL}
            onClick={() => {
              changeWeek(-1);
            }}
          />
          <Toolbar.Button
            size={ButtonSize.SMALL}
            onClick={() => {
              setWeekStart(
                DateService.getWeekStart(DateService.getCurrentDate())
              );
            }}
          >
            Current Week
          </Toolbar.Button>
          <Toolbar.Button
            icon={Icons.CHEVRON_RIGHT}
            size={ButtonSize.SMALL}
            onClick={() => {
              changeWeek(1);
            }}
          />

          <Toolbar.Item classes="ml-6">
            <p className="subtitle">
              Tydzień {weekNo}, {year}
            </p>
          </Toolbar.Item>
        </Toolbar.Left>
      </Toolbar>

      <div
        className="is-flex is-flex-direction-row is-justify-content-space-evenly week-container"
        style={{ flex: "1 1 auto" }}
      >
        {days.map((day) => {
          return <DayView key={day} day={day} entries={visibleEntries} />;
        })}
      </div>
    </>
  );
}

function DayView({ day, entries }) {
  const items = entries.filter(
    (it) => it.date === DateService.toTimestamp(day)
  );

  const { goToDay } = useEntryContext();

  return (
    <div className="week-item">
      <div className="week-item-header" onClick={() => goToDay(day)}>
        {DateService.format(day)}
      </div>
      <div className="week-items">
        {items.map((it) => {
          return <Item key={it.id} item={it} />;
        })}
      </div>
    </div>
  );
}

function Item({ item }) {
  const { editEntry } = useEntryContext();

  return (
    <div className="week-entry" onClick={() => editEntry(item)}>
      {item.task}
    </div>
  );
}
