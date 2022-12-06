import {
  Card,
  IconButton,
  ButtonColor,
  Icon,
  IconText,
  useModal,
} from "components/shared";
import { useEntries } from "hooks";
import { DateService } from "services";
import { Icons } from "consts";
import { EntryModal } from "./EntryModal";

export function Entries() {
  const { entries, show } = useTodaysEntries();

  return (
    <>
      <Card expand={true}>
        <Card.Header>
          <Card.Title
            title={
              <IconText>
                <Icon icon={Icons.ENTRIES} />
                <Icon.Text>Today's entries</Icon.Text>
              </IconText>
            }
          ></Card.Title>
          <Card.Icon></Card.Icon>
        </Card.Header>
        <Card.Content sx={{ maxHeight: "225px", overflowY: "auto" }}>
          <EntryTable data={entries}></EntryTable>
        </Card.Content>
        <Card.Footer>
          <Card.FooterItem>
            <IconButton
              icon={Icons.PLUS}
              color={ButtonColor.LINK_LIGHT}
              onClick={show}
            >
              Add Entry
            </IconButton>
          </Card.FooterItem>
        </Card.Footer>
      </Card>
      <EntryModal />
    </>
  );
}

function EntryTable({ data }) {
  if (!data || data.length === 0) {
    return <p>No data to show</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Entry</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        {data.map((it) => {
          const time = DateService.formatTime(it.duration);
          return (
            <tr key={it.id}>
              <td>{it.task}</td>
              <td>{it.description}</td>
              <td>
                {time.h}:{time.m}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function useTodaysEntries() {
  const { data: entries } = useEntries();
  const showModal = useModal();

  const showForm = () => {
    showModal("entry_form");
  };
  const today = DateService.toTimestamp();

  return {
    show: showForm,
    entries: entries ? entries.filter((e) => e.date === today) : [],
  };
}
