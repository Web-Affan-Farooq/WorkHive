import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  Profile,
  TasksAssigned,
  joinedOrganization,
  Department,
} from "@/@types/types";

interface JoinedOrganizationState extends joinedOrganization {
  id: string;
  name: string;
  email: string;
  users: Profile[];
  department: Department;
  feedTasks: (list: TasksAssigned[]) => void;
  feedUsers: (list: Profile[]) => void;
  setJoinedOrganization: (OrganizationInfo: joinedOrganization) => void;
}

export const useJoinedOrganization = create<JoinedOrganizationState>()(
  devtools(
    persist(
      (set) => ({
        id: "",
        name: "",
        email: "",
        tasks: [],
        users: [],
        department: {
          id: "",
          name: "",
          organizationId: "",
        },
        feedTasks: (list: TasksAssigned[]) =>
          set(() => ({
            tasks: list,
          })),
        feedUsers: (list: Profile[]) =>
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
