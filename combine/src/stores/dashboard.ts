import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Task } from "@/@types/Task";

interface EmployeeDashboardState {
  tasks: Task[];
  feedTasks: (task: Task[]) => void;
}

export const useEmployeeDashboard = create<EmployeeDashboardState>()(
  persist(
    (set) => ({
      tasks: [],
      feedTasks: (tasks: Task[]) => set({ tasks: tasks }),
    })
    ,
    {
      name: 'dashboard-data-employee',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);