import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ProjectsService } from "services";
import { ProjectForm } from "components/forms";
import { Icons } from "consts";

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
              <i className={Icons.PLUS}></i>
            </span>
            <span>Add project</span>
          </button>
        </>
      ) : (
        <div className="box">
          <ProjectForm
            data={selected}
            onClose={(item) => {
              if (item.id === 0) {
                add_project_mut.mutate(item);
              } else {
                update_project_mut.mutate(item);
              }
            }}
            onCancel={() => setMode(Mode.VIEW)}
          />
        </div>
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
                  <i className={Icons.EDIT}></i>
                </span>
                <span className="icon" onClick={() => onDelete(row.id)}>
                  <i className={Icons.DELETE}></i>
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
