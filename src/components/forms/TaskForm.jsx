import { useState } from "react";
import {
  Form,
  ButtonColor,
  Button,
  Message,
  useToast,
} from "components/shared";
import {
  useCategories,
  useProjects,
  useCategoryMutations,
  useProjectMutations,
} from "hooks";
import { CategoryForm } from "./CategoryForm";
import { ProjectForm } from "./ProjectForm";
import { Icons } from "consts";

// what form are we displaying
const ViewMode = {
  TASK: "task",
  CATEGORY: "category",
  PROJECT: "project",
};

// component state
const State = {
  LOADING: "loading",
  ERROR: "error",
  VIEW: "view",
};

export function TaskForm({ data, onClose, onCancel }) {
  const { lists, mode, state, errors, changeView, operations, item } =
    useTaskForm(data);

  if (state === State.LOADING) {
    return <p>Loading</p>;
  }

  if (state === State.ERROR) {
    return <ErrorMessage onClose={onCancel} errors={errors} />;
  }

  const onFormCancel = () => {
    changeView(ViewMode.TASK);
  };

  const onFormClose = (data) => {
    operations[mode](data);
    changeView(ViewMode.TASK);
  };

  return (
    <>
      <div style={{ display: mode === ViewMode.TASK ? "block" : "none" }}>
        <TaskFormRaw
          changeView={changeView}
          lists={lists}
          data={item}
          onClose={onClose}
          onCancel={onCancel}
        />
      </div>
      {mode === ViewMode.CATEGORY && (
        <CategoryForm
          data={{ name: "", id: 0 }}
          onClose={onFormClose}
          onCancel={onFormCancel}
        />
      )}
      {mode === ViewMode.PROJECT && (
        <ProjectForm
          data={{ name: "", id: 0, description: "" }}
          onClose={onFormClose}
          onCancel={onFormCancel}
        />
      )}
    </>
  );
}

function useTaskForm(data) {
  const { success, error } = useToast();
  const {
    data: categories,
    status: catStatus,
    error: catError,
  } = useCategories();
  const {
    data: projects,
    status: projStatus,
    error: projError,
  } = useProjects();

  const { add: cat_add } = useCategoryMutations();
  const { add: proj_add } = useProjectMutations();

  const loading = catStatus === "loading" || projStatus === "loading";
  let errors = [];
  if (catStatus === "error") {
    errors.push(catError.message);
  }

  if (projStatus === "error") {
    errors.push(projError.message);
  }

  let state = State.VIEW;

  if (loading) {
    state = State.LOADING;
  } else if (errors.length > 0) {
    state = State.ERROR;
  }

  const [mode, setMode] = useState(ViewMode.TASK);

  //new data - set default values from lists
  if (data.id === 0) {
    if (projects && projects.length > 0) {
      data.projectId = projects[0].id;
    }

    if (categories && categories.length > 0) {
      data.categoryId = categories[0].id;
    }
  }

  return {
    lists: {
      categories,
      projects,
    },
    operations: {
      [ViewMode.CATEGORY]: (data) => {
        cat_add(data, {
          onSuccess: () => {
            success("Category added");
          },
          onError: (err) => {
            error(err);
          },
        });
      },
      [ViewMode.PROJECT]: (data) =>
        proj_add(data, {
          onSuccess: () => {
            success("Project added");
          },
          onError: (err) => {
            error(err);
          },
        }),
    },
    mode,
    state,
    errors,
    changeView: setMode,
    item: data,
  };
}

function TaskFormRaw({ changeView, data, lists, onClose, onCancel }) {
  const { projects, categories } = lists;
  const add_category = () => {
    changeView(ViewMode.CATEGORY);
  };
  const add_project = () => {
    changeView(ViewMode.PROJECT);
  };

  return (
    <Form initialData={data} onSubmit={onClose}>
      <Form.Field>
        <Form.Label>Name</Form.Label>
        <Form.Input placeholder="name" name="name"></Form.Input>
      </Form.Field>
      <Form.Field>
        <Form.Label>Category</Form.Label>
      </Form.Field>
      <Form.FieldGroup dense>
        <Form.Select name="categoryId" expanded={1}>
          {categories.map((it) => {
            return (
              <Form.Option
                key={it.id}
                value={it.id}
                name={it.name}
              ></Form.Option>
            );
          })}
        </Form.Select>
        <Form.IconButton
          title="Add new category"
          icon={Icons.PLUS}
          color={ButtonColor.LINK}
          onClick={add_category}
          outlined
        ></Form.IconButton>
      </Form.FieldGroup>
      <Form.Field>
        <Form.Label>Project</Form.Label>
      </Form.Field>
      <Form.FieldGroup dense>
        <Form.Select name="projectId" expanded={1}>
          {projects.map((it) => {
            return (
              <Form.Option
                key={it.id}
                value={it.id}
                name={it.name}
              ></Form.Option>
            );
          })}
        </Form.Select>
        <Form.IconButton
          title="Add new project"
          icon={Icons.PLUS}
          color={ButtonColor.LINK}
          onClick={add_project}
          outlined
        ></Form.IconButton>
      </Form.FieldGroup>
      {/*
      <Form.Field>
        <Form.Label>Status</Form.Label>
        <Form.Select name="status" expanded={1}>
          {Status.map((it) => {
            return <Form.Option key={it} value={it} name={it}></Form.Option>;
          })}
        </Form.Select>
      </Form.Field>
        */}
      <Form.Field>
        <Form.Label>Description</Form.Label>
        <Form.Textarea
          placeholder="description"
          name="description"
        ></Form.Textarea>
      </Form.Field>
      <Form.FieldGroup>
        <Form.Button submit color={ButtonColor.LINK}>
          Save
        </Form.Button>
        <Form.Button color={ButtonColor.LINK_LIGHT} onClick={onCancel}>
          Cancel
        </Form.Button>
      </Form.FieldGroup>
    </Form>
  );
}

function ErrorMessage({ errors, onClose }) {
  return (
    <Message color="is-danger">
      <Message.Header>
        <p>Error loading data</p>
      </Message.Header>
      <Message.Body>
        {errors.map((e, i) => {
          return <p key={i}>{e}</p>;
        })}
        <Button color={ButtonColor.DANGER} onClick={onClose}>
          OK
        </Button>
      </Message.Body>
    </Message>
  );
}
