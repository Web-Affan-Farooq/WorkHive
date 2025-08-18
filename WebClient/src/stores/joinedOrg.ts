import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Departments, Profile } from "@/@types/modeltypes";
import { Task } from "@/@types/Task";

interface OrganizationInfo {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  users: Omit<Profile, "id">[];
  department: Departments;
}
interface JoinedOrg {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  users: Omit<Profile, "id">[];
  department: Departments | null;
  feedTasks: (list: Task[]) => void;
  feedUsers: (list: Omit<Profile, "id">[]) => void;
  setJoinedOrganization: (OrganizationInfo: OrganizationInfo) => void;
}

export const useJoinedOrganization = create<JoinedOrg>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        name: "",
        email: "",
        tasks: [],
        users: [],
        department: null,
        feedTasks: (list: Task[]) =>
          set(() => ({
            tasks: list,
          })),
        feedUsers: (list: Omit<Profile, "id">[]) =>
          set(() => ({
            users: list,
          })),

        setJoinedOrganization: ({
          id,
          name,
          email,
          tasks,
          users,
          department,
        }) =>
          set(() => ({
            id: id,
            name: name,
            email: email,
            tasks: tasks,
            users: users,
            department: department,
          })),
      }),
      {
        name: "joined-organization-data",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
