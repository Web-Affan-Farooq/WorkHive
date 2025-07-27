import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Users } from "@/@types/Users";
import { Task } from "@/@types/Task";
import { Department } from "@/@types/Departments";
import { Notifications } from "@/@types/Notifications";

interface OrganizationState {
  users: Users[];
  deleteProfile: (id: string) => void;
  tasks: Task[];
  departments: Department[];
  notifications: Notifications[];
  feedNotifications: (list: Notifications[]) => void;
  feedTasks: (task: Task[]) => void;
  feedDepartments: (departments: Department[]) => void;
  feedUsers: (users: Users[]) => void;
  clearUsers: () => void;
  addTasks: (task: Task) => void;
  deleteTask: (id: string) => void;
  deleteNotification: (id: string) => void;
}

export const useOrganizationDashboard = create<OrganizationState>()(
  persist(
    (set) => ({
      users: [],
      deleteProfile: (id: string) => set((state) => (
        {
          users: state.users.filter((user) => user.id !== id)
        }
      )),
      tasks: [],
      departments: [],
      notifications: [],
      feedNotifications: (list) => set(() => ({
        notifications: list,
      })),
      feedDepartments: (departments: Department[]) => set({ departments: departments }),
      feedTasks: (tasks: Task[]) => set({ tasks: tasks }),
      feedUsers: (users) => set({ users }),
      clearUsers: () => set({ users: [] }),
      deleteTask: (id: string) => set((state) => (
        {
          tasks: state.tasks.filter((t) => t.id !== id)
        }
      )),
      deleteNotification: (id: string) => set((state) => (
        {
          notifications: state.notifications.filter((n) => n.id !== id)
        }
      )),
      addTasks: (task: Task) => set((state) => (
        {
          tasks: [...state.tasks, task,]
        }
      )
      )
    })
    ,
    {
      name: 'dashboard-data',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
