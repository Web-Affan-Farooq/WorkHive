import { create } from "zustand";
import { persist ,createJSONStorage} from "zustand/middleware";

import { Users } from "@/@types/Users";
import { Task } from "@/@types/Task";
import { Department } from "@/@types/Departments";
import { Notifications } from "@/@types/Notifications";

interface OrganizationState {
  users: Users[];
  tasks:Task[];
  departments:Department[];
  notifications:Notifications[];
  feedNotifications:(list:Notifications[]) => void;
  feedTasks:(task:Task[]) => void;
  feedDepartments:(departments:Department[]) => void;
   feedUsers: (users: Users[]) => void;
  clearUsers: () => void;
  addTasks:(task:Task) => void;
}

export const useOrganizationDashboard = create<OrganizationState>()(
  persist(
    (set) => ({
      users: [],
      tasks:[],
      departments:[],
      notifications:[],
      feedNotifications:(list) => set(() => ({
        notifications:list,
      })),
      feedDepartments:(departments:Department[]) => set({departments:departments}),
      feedTasks:(tasks:Task[]) => set({tasks:tasks}),
      feedUsers: (users) => set({ users }),
      clearUsers: () => set({ users: [] }),
      addTasks:(task:Task) => set((state) => (
        {
          tasks:[...state.tasks,task,]
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
