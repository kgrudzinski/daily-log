import { useState } from "react";

const Mode = {
  VIEW: "view",
  EDIT: "edit",
};

const EmptyTask = {
  name: "",
  description: "",
  project: 0,
  category: 0,
};

export function Tasks() {
  console.log(Mode);

  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState(Mode.VIEW);
  console.log(mode);
  const newTaskClick = () => {
    setMode(Mode.EDIT);
  };

  const onDialogClose = (e) => {
    e.preventDefault();
    setMode(Mode.VIEW);
    setTasks([]);
  };

  return (
    <>
      {mode === Mode.VIEW ? (
        <>
          <button className="button" onClick={newTaskClick}>
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add task</span>
          </button>
          <TaskList tasks={tasks} />
        </>
      ) : (
        <TaskDialog
          task={EmptyTask}
          onCancel={onDialogClose}
          onClose={onDialogClose}
        />
      )}
    </>
  );
}

function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No data to show</p>;
  }
  return <div>table</div>;
}

function TaskDialog({ task, onClose, onCancel }) {
  return (
    <div className="box">
      <form>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              placeholder="Task name"
              value={task.name}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <textarea
              className="textarea"
              type="text"
              placeholder="Description"
              value={task.description}
            />
          </div>
        </div>
        <div className="field">
          <label className="label">Project</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select>
                <option value={1}>Project 1</option>
                <option value={2}>Project 2</option>
              </select>
            </div>
          </div>
        </div>
        <div className="field">
          <label className="label">Category</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select>
                <option value={1}>Category 1</option>
                <option value={2}>Category 2</option>
              </select>
            </div>
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button className="button is-link" onClick={onClose}>
              Ok
            </button>
          </div>
          <div className="control">
            <button className="button is-link is-light" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
