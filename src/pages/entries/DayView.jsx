import { useState } from "react";
//import { useEntryContext } from "./Context";
import { DateService } from "services";
import { Buttons, Button } from "components/shared";
import { EntryItem } from "./EntryItem";

export function DailyVew({ entries }) {
  const [currDate, setCurrDate] = useState(DateService.getCurrentDate());
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
      <div>
        <Buttons>
          <Button
            onClick={() => {
              changeDate(-1);
            }}
          >
            &lt;
          </Button>
          <Button
            onClick={() => {
              setCurrDate(new Date());
            }}
          >
            Today
          </Button>
          <Button
            onClick={() => {
              changeDate(1);
            }}
          >
            &gt;
          </Button>
        </Buttons>
        <span>{DateService.format(currDate)}</span>
      </div>
      <div>
        {visibleEntries.map((it) => {
          return <EntryItem key={it.id} item={it} />;
        })}
      </div>
    </>
  );
}