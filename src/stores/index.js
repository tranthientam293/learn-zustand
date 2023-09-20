import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const store = (set) => ({
  tasks: [],
  draggedTask: null,
  addTask: (title, state) =>
    set(
      // (store) => ({
      //   tasks: [...store.tasks, { title, state }],
      // }),
      produce((store) => {
        store.tasks.push({ title, state });
      }),
      false,
      "addTask"
    ),
  deleteTask: (title) =>
    set(
      (store) => ({
        tasks: store.tasks.filter((task) => task.title !== title),
      }),
      false,
      "deleteTask"
    ),
  setDraggedTask: (title) =>
    set({ draggedTask: title }, false, "setDraggedTask"),
  moveTask: (title, state) =>
    set(
      (store) => ({
        tasks: store.tasks.map((task) =>
          task.title === title ? { title, state } : task
        ),
      }),
      false,
      "moveTask"
    ),
});

const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

export const useStore = create(
  log(persist(devtools(store), { name: "store" }))
);
