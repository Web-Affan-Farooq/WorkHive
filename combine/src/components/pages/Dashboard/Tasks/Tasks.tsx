"use client"
import { DashboardSidebar } from "@/components/layout";
import Card from "./Card";
import { Suspense } from "react";
import { useEmployeeDashboard } from "@/stores/dashboard";

// _______ Fallback ui 
const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-lg font-semibold text-gray-600">Loading tasks...</div>
    </div>
  );
};

const TasksList = () => {
  const {tasks} = useEmployeeDashboard();

  return (
    <div className="flex flex-row flex-wrap gap-6">
      {tasks.length <= 0 ? <p className="text-gray-400 text-sm">No tasks found ...</p> : tasks.map((task, idx) => (
        <Card task={task} key={idx} />
      ))}
    </div>
  )
}

const Tasks = () => {
  return (
    <main className="flex h-screen bg-white">
      <DashboardSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tasks Assigned</h1>
        <Suspense fallback={<Loading />}>
          <TasksList />
        </Suspense>
      </section>
    </main>
  );
};

export default Tasks;