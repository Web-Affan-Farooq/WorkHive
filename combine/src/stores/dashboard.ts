import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Task } from "@/@types/Task";

interface EmployeeDashboardState {
  tasks: Task[];
  markAsDone: (task: Task) => void;
  feedTasks: (task: Task[]) => void;
}

export const useEmployeeDashboard = create<EmployeeDashboardState>()(
  persist(
    (set) => ({
      tasks: [],
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
    }),
    {
      name: 'dashboard-data-employee',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);