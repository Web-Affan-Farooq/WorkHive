import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage, devtools } from "zustand/middleware";
import { TaskOwned, Department, OwnedOrganization } from "@/@types/types";

interface OwnedOrg extends OwnedOrganization {
  addDepartment: (dept: Department) => void;
  deleteDepartment: (deptId: string) => void;

  addTask: (task: TaskOwned) => void;
  deleteTask: (taskId: string) => void;

  feedDepartments: (list: Department[]) => void;
  feedTasks: (list: TaskOwned[]) => void;

  setOwnedOrganization: (info: OwnedOrganization) => void;
}

export const useOwnedOrganization = create<OwnedOrg>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        name: "",
        email: "",
        departments: [],

        addDepartment: (dept) =>
          set((state) => ({
            departments: [...state.departments, dept],
            users: {
              ...state.users,
              [dept.id]: [],
            },
          })),

        deleteDepartment: (deptId) =>
          set((state) => {
            /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
            const { [deptId]: _, ...restUsers } = state.users;
            return {
              departments: state.departments.filter(
                (dept) => dept.id !== deptId
              ),
              users: restUsers,
            };
          }),

        users: {},
        tasks: [],

        feedDepartments: (list: Department[]) =>
          set(() => ({
            departments: list,
          })),

        feedTasks: (list: TaskOwned[]) =>
          set(() => ({
            tasks: list,
          })),

        setOwnedOrganization: (info) =>
          set(() => ({
            id: info.id,
            name: info.name,
            email: info.email,
            departments: info.departments,
            users: info.users,
            tasks: info.tasks,
          })),

        addTask: (task) =>
          set((state) => ({
            tasks: [...state.tasks, task],
          })),

        deleteTask: (taskId) =>
          set((state) => ({
            tasks: state.tasks.filter((tsk) => tsk.id !== taskId),
          })),
      }),
      {
        name: "owned-organization-data",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
