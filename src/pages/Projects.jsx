import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ProjectsService } from "services";
import { Form } from "components/shared";
import { ButtonColor } from "components/shared";

const NEW_TASK = {
  id: 0,
  name: "",
  description: "",
  status: "Idle",
  categories: [],
};

const Mode = {
  VIEW: "view",
  EDIT: "edit",
};

export function Projects() {
  const [mode, setMode] = useState(Mode.VIEW);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(NEW_TASK);

  const queryClient = useQueryClient();

  const projects = useQuery(["projects"], ProjectsService.get, {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  console.log("projects", projects);

  const add_project_mut = useMutation(ProjectsService.add, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
      setMode(Mode.VIEW);
    },
    onError: (error) => {
      setMode(Mode.VIEW);
      setError(error);
    },
  });

  const update_project_mut = useMutation(ProjectsService.update, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
      setMode(Mode.VIEW);
    },
    onError: (error) => {
      setMode(Mode.VIEW);
      setError(error);
    },
  });

  const delete_project_mut = useMutation(ProjectsService.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries("projects");
      setMode(Mode.VIEW);
    },
    onError: (error) => {
      setMode(Mode.VIEW);
      setError(error);
      console.log(error);
    },
  });

  const onEditClick = (item) => {
    setSelected(item);
    setMode(Mode.EDIT);
  };

  const onDeleteClick = (id) => {
    delete_project_mut.mutate(id);
  };

  if (projects.isLoading) {
    return <h3>Loading data</h3>;
  }

  if (projects.isError) {
    return <h3>{projects.error.message}</h3>;
  }

  return (
    <div>
      {mode === Mode.VIEW ? (
        <>
          <ProjectList
            data={projects.data}
            onEdit={onEditClick}
            onDelete={onDeleteClick}
          />
          <button
            className="button"
            onClick={() => {
              setSelected(NEW_TASK);
              setMode(Mode.EDIT);
            }}
          >
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add project</span>
          </button>
        </>
      ) : (
        <ProjectForm
          project={selected}
          onClose={(item) => {
            if (item.id === 0) {
              add_project_mut.mutate(item);
            } else {
              update_project_mut.mutate(item);
            }
          }}
          onCancel={() => setMode(Mode.VIEW)}
        />
      )}
      {error && (
        <div className="notification is-danger">
          <button className="delete" onClick={() => setError(null)}></button>
          {error}
        </div>
      )}
    </div>
  );
}

function ProjectList({ data, onEdit, onDelete }) {
  return (
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.description}</td>
              <td>{row.status}</td>
              <td>
                <span className="icon" onClick={() => onEdit(row)}>
                  <i className="fas fa-edit"></i>
                </span>
                <span className="icon" onClick={() => onDelete(row.id)}>
                  <i className="fas fa-trash-alt"></i>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function ProjectForm({ project, onClose, onCancel }) {
  return (
    <div className="box">
      <Form initialData={project} onSubmit={onClose}>
        <Form.Field>
          <Form.Label>Name</Form.Label>
          <Form.Input placeholder="Project name" name="name"></Form.Input>
        </Form.Field>
        <Form.Field>
          <Form.Label>Description</Form.Label>
          <Form.Textarea
            placeholder="Description"
            name="description"
          ></Form.Textarea>
        </Form.Field>
        <Form.FieldGroup>
          <Form.Button submit color={ButtonColor.LINK}>
            OK
          </Form.Button>
          <Form.Button color={ButtonColor.LINK_LIGHT} onClick={onCancel}>
            Cancel
          </Form.Button>
        </Form.FieldGroup>
      </Form>
    </div>
  );
}
/*
function ProjectSettings({ project, onClose, onCancel }) {
  const [data, setData] = useState(project);

  const onChange = (evt) => {
    setData({ ...data, [evt.target.name]: evt.target.value });
  };

  return (
    <div className="box">
      <div className="field">
        <label className="label">Name</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Project name"
            value={data.name}
            name="name"
            onChange={onChange}
          />
        </div>
      </div>
      <div className="field">
        <label className="label">Description</label>
        <div className="control">
          <textarea
            className="textarea"
            type="text"
            placeholder="Description"
            value={data.description}
            name="description"
            onChange={onChange}
          />
        </div>
      </div>
      <div>
        <label className="label">Categories</label>
        <div className="columns">
          <div className="column">
            <div className="select">
              <select size="8"></select>
            </div>
          </div>
          <div className="column">Kol 2</div>
          <div className="column">
            <div className="control">
              <div className="is-multiple select">
                <select size="8"></select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={() => onClose(data)}>
            Ok
          </button>
        </div>
        <div className="control">
          <button className="button is-link is-light" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
*/
