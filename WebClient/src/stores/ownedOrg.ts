import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage, devtools } from "zustand/middleware";
import {
  TaskOwned,
  Department,
  OwnedOrganization,
  ExtendedComment,
} from "@/@types/types";
import {
  CreateDepartmentAction,
  DeleteDepartmentAction,
} from "@/actions/departments";
import { toast } from "sonner";
import { AddCommentAction, DeleteCommentAction } from "@/actions/comments";
import { CreateTaskAction } from "@/actions/tasks";

import z from "zod";
import { TaskCreationSchema } from "@/validations";

type TaskCreationFormData = z.infer<typeof TaskCreationSchema>;

interface OwnedOrg extends OwnedOrganization {
  addDepartment: (name: string, organizationId: string) => void;
  deleteDepartment: (deptId: string) => void;

  addTask: (task: TaskCreationFormData) => void;
  deleteTask: (taskId: string) => void;

  addComment: (taskId: string, text: string) => void;
  deleteComment: (commentId: string) => void;
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
        allUsers: [],

        setOwnedOrganization: (info) =>
          set(() => ({
            id: info.id,
            name: info.name,
            email: info.email,
            departments: info.departments,
            users: info.users,
            allUsers: info.allUsers,
            tasks: info.tasks,
          })),

        addDepartment: async (name, organizationId) => {
          const { message, success, department } = await CreateDepartmentAction(
            {
              name: name,
              organizationId: organizationId,
            }
          );
          if (!success) {
            toast.error(message);
          }
          if (department) {
            set((state) => ({
              departments: [...state.departments, department],
              users: {
                ...state.users,
                [department.id]: [],
              },
            }));
          }
        },

        deleteDepartment: async (deptId) => {
          // ______ utilize server action for deletingd epartment from database ...
          const { message, success } = await DeleteDepartmentAction(deptId);
          if (!success) {
            toast.error(message);
          }

          // ______ Update the state ...
          set((state) => {
            /* eslint-disable-next-line  @typescript-eslint/no-unused-vars */
            const { [deptId]: _, ...restUsers } = state.users;
            return {
              departments: state.departments.filter(
                (dept) => dept.id !== deptId
              ),
              users: restUsers,
            };
          });
          // ______ Show success message  ...
          toast.success(message);
        },

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

        addTask: async (t) => {
          const {message , success  , task} = await CreateTaskAction(t)
          if(!success) {
            toast.error(message)
          }
          if(task) {
            set((state) => ({
            tasks: [...state.tasks, task],
          }));
          }
        },

        deleteTask: (taskId) =>
          set((state) => ({
            tasks: state.tasks.filter((tsk) => tsk.id !== taskId),
          })),

        addComment: async (taskId, text) => {
          const { message, success, comment } = await AddCommentAction({
            taskId: taskId,
            text: text,
          });
          if (!success) {
            toast.error(message);
          }
          if (comment) {
            set((state) => {
              const updatedTaskList = state.tasks.map((tsk) => {
                return {
                  ...tsk,
                  comments: [...tsk.comments, comment],
                };
              });

              return {
                tasks: updatedTaskList,
              };
            });
          }
        },

        deleteComment: async (commentId) => {
          const { message, success } = await DeleteCommentAction(commentId);
          if (!success) {
            toast.error(message);
          }

          set((state) => {
            const updatedTaskList = state.tasks.map((tsk) => {
              return {
                ...tsk,
                comments: tsk.comments.filter((comm) => comm.id !== commentId),
              };
            });
            return {
              tasks: updatedTaskList,
            };
          });

          toast.success(message);
        },
      }),
      {
        name: "owned-organization-data",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
