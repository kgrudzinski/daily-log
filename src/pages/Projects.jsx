import { useState } from "react";
import { useProjects, useProjectMutations } from "hooks";
import { ProjectForm } from "components/forms";
import {
  useToast,
  Buttons,
  FilterProvider,
  IconButton,
  ButtonColor,
  Table,
} from "components/shared";
import { Icons, Status } from "consts";

const NEW_PROJECT = {
  id: 0,
  name: "",
  description: "",
  status: Status.IDLE,
  categories: [],
};

const Mode = {
  VIEW: "view",
  EDIT: "edit",
};

export function Projects() {
  const [mode, setMode] = useState(Mode.VIEW);
  const [selected, setSelected] = useState(NEW_PROJECT);

  const { success, error } = useToast();
  const projects = useProjects();

  const mutations = useProjectMutations();

  const add_project_mut = (data) => {
    mutations.add(data, {
      onSuccess: () => {
        success("Project added");
        setMode(Mode.VIEW);
      },
      onError: (err) => {
        setMode(Mode.VIEW);
        error(err);
        console.log(err);
      },
    });
  };

  const update_project_mut = (data) => {
    mutations.update(data, {
      onSuccess: () => {
        success("Project updated");
        setMode(Mode.VIEW);
      },
      onError: (err) => {
        setMode(Mode.VIEW);
        console.log(err);
        error(err);
      },
    });
  };

  const delete_project_mut = (id) => {
    mutations.remove(id, {
      onSuccess: () => {
        success("Project deleted");
        setMode(Mode.VIEW);
      },
      onError: (err) => {
        setMode(Mode.VIEW);
        error(err);
        console.log(err);
      },
    });
  };

  const onEditClick = (item) => {
    setSelected(item);
    setMode(Mode.EDIT);
  };

  const onDeleteClick = (id) => {
    delete_project_mut(id);
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
          <IconButton
            icon={Icons.PLUS}
            color={ButtonColor.LINK_LIGHT}
            onClick={() => {
              setSelected(NEW_PROJECT);
              setMode(Mode.EDIT);
            }}
          >
            Add project
          </IconButton>
        </>
      ) : (
        <div className="box">
          <ProjectForm
            data={selected}
            onClose={(item) => {
              if (item.id === 0) {
                add_project_mut(item);
              } else {
                update_project_mut(item);
              }
            }}
            onCancel={() => setMode(Mode.VIEW)}
          />
        </div>
      )}
    </div>
  );
}

function ProjectControls({ item, onEdit, onDelete }) {
  return (
    <Buttons dense>
      <IconButton icon={Icons.EDIT} onClick={() => onEdit(item)}></IconButton>
      <IconButton
        icon={Icons.DELETE}
        onClick={() => onDelete(item.id)}
      ></IconButton>
    </Buttons>
  );
}

function ProjectList({ data, onEdit, onDelete }) {
  const columns = [
    {
      field: "name",
      label: "Name",
    },
    {
      field: "description",
      label: "Description",
    },
    {
      field: "",
      label: "Actions",
      render: (row) => {
        return (
          <ProjectControls item={row} onDelete={onDelete} onEdit={onEdit} />
        );
      },
    },
  ];

  if (data.length === 0) {
    return <p>No data to show</p>;
  }

  return (
    <FilterProvider caseSensitive={false}>
      <Table columns={columns} data={data} />
    </FilterProvider>
  );
}
