import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Profile } from "@/@types/modeltypes";
import { Task } from "@/@types/Task";

interface OrganizationInfo {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  users: Profile[];
}
interface JoinedOrg {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  users: Profile[];
  feedTasks: (list: Task[]) => void;
  feedUsers: (list: Profile[]) => void;
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

        feedTasks: (list: Task[]) =>
          set(() => ({
            tasks: list,
          })),
        feedUsers: (list: Profile[]) =>
          set(() => ({
            users: list,
          })),

        setJoinedOrganization: ({ id, name, email, tasks, users }) =>
          set(() => ({
            id: id,
            name: name,
            email: email,
            tasks: tasks,
            users: users,
          })),
      }),
      {
        name: "joined-organization-data",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
