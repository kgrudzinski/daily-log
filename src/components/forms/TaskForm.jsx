import { useReducer } from "react";
import { Form, ButtonColor, Button, Message } from "components/shared";
import {
  useCategories,
  useProjects,
  useCategoryMutations,
  useProjectMutations,
} from "hooks";
import { CategoryForm } from "./CategoryForm";
import { ProjectForm } from "./ProjectForm";

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

const Status = ["Idle", "InProgress, Completed"];

export function TaskForm({ data, onClose, onCancel }) {
  const { lists, mode, state, errors, dispatch, operations } = useTaskForm();

  if (state === State.LOADING) {
    return <p>Loading</p>;
  }

  if (state === State.ERROR) {
    return <ErrorMessage onClose={onCancel} errors={errors} />;
  }

  const onFormCancel = () => {
    dispatch(ViewMode.TASK);
  };

  const onFormClose = (data) => {
    operations[mode](data);
    dispatch(ViewMode.TASK);
  };

  return (
    <>
      <div style={{ display: mode === ViewMode.TASK ? "block" : "none" }}>
        <TaskFormRaw
          dispatch={dispatch}
          lists={lists}
          data={data}
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

function dispatcher(action, state) {
  console.log(action, state);
  return action;
}

function useTaskForm() {
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

  let mode = ViewMode.TASK;
  let state = State.VIEW;

  if (loading) {
    state = State.LOADING;
  } else if (errors.length > 0) {
    state = State.ERROR;
  }

  const [, dispatch] = useReducer(dispatcher, mode);

  return {
    lists: {
      categories,
      projects,
    },
    operations: {
      [ViewMode.CATEGORY]: cat_add,
      [ViewMode.PROJECT]: proj_add,
    },
    mode,
    state,
    errors,
    dispatch,
  };
}

function TaskFormRaw({ dispatch, data, lists, onClose, onCancel }) {
  const { projects, categories } = lists;
  const add_category = () => {
    dispatch(ViewMode.CATEGORY);
  };
  const add_project = () => {
    dispatch(ViewMode.PROJECT);
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
        <Form.Select name="categoryId">
          {categories.map((it) => {
            return (
              <Form.Option
                key={it.id}
                value={it.id}
                name={it.name}
                selected={data.categoryId === it.id}
              ></Form.Option>
            );
          })}
        </Form.Select>
        <Form.IconButton
          icon="fas fa-plus"
          color={ButtonColor.LINK}
          onClick={add_category}
        ></Form.IconButton>
      </Form.FieldGroup>
      <Form.Field>
        <Form.Label>Project</Form.Label>
      </Form.Field>
      <Form.FieldGroup dense>
        <Form.Select name="projectId">
          {projects.map((it) => {
            return (
              <Form.Option
                key={it.id}
                value={it.id}
                name={it.name}
                selected={data.projectId === it.id}
              ></Form.Option>
            );
          })}
        </Form.Select>
        <Form.IconButton
          icon="fas fa-plus"
          color={ButtonColor.LINK}
          onClick={add_project}
        ></Form.IconButton>
      </Form.FieldGroup>
      <Form.Field>
        <Form.Label>Status</Form.Label>
        <Form.Select name="status">
          {Status.map((it) => {
            return (
              <Form.Option
                key={it}
                value={it}
                name={it}
                selected={data.status === it}
              ></Form.Option>
            );
          })}
        </Form.Select>
      </Form.Field>
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
