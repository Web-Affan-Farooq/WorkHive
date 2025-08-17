import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage, devtools } from "zustand/middleware";
import { Departments, Profile } from "@/@types/modeltypes";
import { Task } from "@/@types/Task";

interface OrganizationInfo {
  id: string;
  name: string;
  email: string;
  departments: Departments[];
  users: Record<string, Profile[]>;
  tasks: Task[];
}

interface OwnedOrg {
  id: string;
  name: string;
  email: string;
  users: Record<string, Profile[]>;

  departments: Departments[];
  addDepartment: (dept: Departments) => void;
  deleteDepartment: (deptId: string) => void;

  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;

  feedDepartments: (list: Departments[]) => void;
  feedTasks: (list: Task[]) => void;

  setOwnedOrganization: (info: OrganizationInfo) => void;
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

        feedDepartments: (list: Departments[]) =>
          set(() => ({
            departments: list,
          })),

        feedTasks: (list: Task[]) =>
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
