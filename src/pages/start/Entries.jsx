import {
  Card,
  IconButton,
  ButtonColor,
  Icon,
  IconText,
  Modal,
  useModal,
  useToast,
} from "components/shared";
import { EntryForm } from "components/forms";
import { useEntries, useEntryMutations } from "hooks";
import { DateService, RandService } from "services";

export function Entries() {
  const { entries, show, save } = useTodaysEntries();

  return (
    <>
      <Card expand={true}>
        <Card.Header>
          <Card.Title
            title={
              <IconText>
                <Icon icon="fas fa-bars" />
                <Icon.Text>Today's entries</Icon.Text>
              </IconText>
            }
          ></Card.Title>
          <Card.Icon></Card.Icon>
        </Card.Header>
        <Card.Content>
          <EntryTable data={entries}></EntryTable>
        </Card.Content>
        <Card.Footer>
          <Card.FooterItem>
            <IconButton
              icon="fas fa-plus"
              color={ButtonColor.LINK_LIGHT}
              onClick={show}
            >
              Add Entry
            </IconButton>
          </Card.FooterItem>
        </Card.Footer>
      </Card>
      <FormModal save={save} />
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

function FormModal({ save }) {
  const entry = {
    id: 0,
    taskId: 0,
    description: "",
    duration: 0,
    date: DateService.format(new Date()),
  };

  const showModal = useModal();
  const hide = () => showModal("");

  return (
    <Modal id="entry_form">
      <div className="box">
        <EntryForm
          key={RandService.generateId()}
          data={entry}
          onCancel={hide}
          onClose={(data) => {
            save(data);
            hide();
          }}
        />
      </div>
    </Modal>
  );
}

function useTodaysEntries() {
  const { data: entries } = useEntries();
  const { error, success } = useToast();
  const showModal = useModal();

  const saveForm = (data) => {
    const dataToSave = {
      ...data,
      duration: +data.duration,
      taskId: +data.taskId,
      date: DateService.fromString(data.date),
    };
    add(dataToSave);
  };

  const { add } = useEntryMutations(
    () => {
      showModal("");
      success("Entry added");
    },
    (err) => error(err)
  );

  const showForm = () => showModal("entry_form");
  const today = DateService.toTimestamp();

  return {
    save: saveForm,
    show: showForm,
    entries: entries ? entries.filter((e) => e.date === today) : [],
  };
}
