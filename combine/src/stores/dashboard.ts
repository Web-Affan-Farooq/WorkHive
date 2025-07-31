import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Task } from "@/@types/Task";
import { Notifications } from "@/@types/Notifications";

interface User {
  name: string;
  email: string;
  createdAt:Date,
}
interface EmployeeDashboardState {
  tasks: Task[];
  user: User,
  notifications: Notifications[];
  feedUser:(user:User) => void;
  feedNotifications: (list: Notifications[]) => void;
  deleteNotification: (id: string) => void;
  markAsDone: (task: Task) => void;
  feedTasks: (task: Task[]) => void;
  clearCache:() => void;
}

export const useEmployeeDashboard = create<EmployeeDashboardState>()(
  persist(
    (set) => ({
      tasks: [],
      user: {
        name: "",
        email: "",
        createdAt:new Date(),
      },
      feedUser:(user:User) => set({
        user:{...user}
      }),
      notifications: [],
      feedNotifications: (list: Notifications[]) => set(() => ({
        notifications: list,
      })),
      deleteNotification: (id: string) => set((state) => ({
        notifications: state.notifications.filter((not) => (not.id !== id))
      })),
      markAsDone: (task) => set((state) => ({
        tasks: state.tasks.map((t) => {
          if (t.id === task.id) {
            return task
          } else {
            return t
          }
        })
      })),
      feedTasks: (tasks: Task[]) => set({ tasks: tasks }),
      clearCache : () => set(() => (
        {
          tasks:[],
          user:{
            name:"",
            email:"",
            createdAt:new Date(),
          },
          notifications:[],
        }
      )),
      
    }),
    {
      name: 'dashboard-data-employee',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);