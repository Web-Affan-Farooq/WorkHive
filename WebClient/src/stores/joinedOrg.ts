import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import {
  Profile,
  TasksAssigned,
  joinedOrganization,
  Department,
  ExtendedComment,
} from "@/@types/types";

interface JoinedOrganizationState extends joinedOrganization {
  id: string;
  name: string;
  email: string;
  users: Omit<Profile, "id">[];
  department: Department;

  addComment: (comment: ExtendedComment) => void;
  deleteComment: (commentId: string) => void;
  feedTasks: (list: TasksAssigned[]) => void;
  feedUsers: (list: Omit<Profile, "id">[]) => void;
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
        addComment: (comment) =>
          set((state) => {
            const updatedTaskList = state.tasks.map((tsk) => {
              if (tsk.id === comment.taskId) {
                return {
                  ...tsk,
                  comments: [...tsk.comments, comment],
                };
              } else return tsk;
            });

            return {
              tasks: updatedTaskList,
            };
          }),
        deleteComment: (commentId) =>
          set((state) => {
            const updatedTaskList = state.tasks.map((tsk) => {
              return {
                ...tsk,
                comments: tsk.comments.filter((comm) => comm.id === commentId),
              };
            });
            return {
              tasks: updatedTaskList,
            };
          }),
        feedTasks: (list: TasksAssigned[]) =>
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
