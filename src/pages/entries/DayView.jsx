import { useState } from "react";
//import { useEntryContext } from "./Context";
import { DateService } from "services";
import { ButtonSize, Toolbar } from "components/shared";
import { EntryItem } from "./EntryItem";
import { Icons } from "consts";

export function DailyVew({ date, entries }) {
  const [currDate, setCurrDate] = useState(
    date || DateService.getCurrentDate()
  );
  //const { deleteEntry, setMode, setSelectedId } = useEntryContext();

  const changeDate = (val) => {
    setCurrDate((d) => DateService.addDays(d, val));
  };

  const visibleEntries = entries.filter(
    (it) => it.date === DateService.toTimestamp(currDate)
  );

  console.log(visibleEntries);

  return (
    <>
      <Toolbar classes="mb-1 toolbar pl-2 pr-2">
        <Toolbar.Left>
          <Toolbar.Button
            size={ButtonSize.SMALL}
            title="Prevoius day"
            icon={Icons.CHEVRON_LEFT}
            onClick={() => {
              changeDate(-1);
            }}
          />

          <Toolbar.Button
            size={ButtonSize.SMALL}
            onClick={() => {
              setCurrDate(new Date());
            }}
          >
            Today
          </Toolbar.Button>
          <Toolbar.Button
            size={ButtonSize.SMALL}
            title="Next day"
            icon={Icons.CHEVRON_RIGHT}
            onClick={() => {
              changeDate(1);
            }}
          />
          <Toolbar.Item classes="ml-6">
            <p className="subtitle">{DateService.format(currDate)}</p>
          </Toolbar.Item>
        </Toolbar.Left>
      </Toolbar>
      <div className="day-view">
        {visibleEntries.map((it) => {
          return <EntryItem key={it.id} item={it} />;
        })}
      </div>
    </>
  );
}
