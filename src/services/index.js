import { invoke } from "@tauri-apps/api/tauri";

export { DateService } from "./dates";
export { AppService } from "./app";
export { RandService } from "./rand";

let query = (name, args) => {
  return invoke(name, args)
    .then((data) => {
      return new Promise(function (resolve, _reject) {
        resolve(data);
      });
    })
    .catch((err) => {
      throw err;
    });
};

let createService = (name) => {
  return {
    get: function () {
      return query(`get_${name}_list`);
    },
    add: function (item) {
      return query(`add_${name}`, { item });
    },
    update: function (item) {
      return query(`update_${name}`, { item });
    },
    remove: function (id) {
      return query(`delete_${name}`, { id: id });
    },
  };
};

export const ProjectsService = createService("project");
export const CategoriesService = createService("category");
export const TasksService = createService("task");
export const EntriesService = createService("entry");
