"use client"
import React, { useState } from "react";
import { ManagementSidebar } from "../../layout";
import { Task } from "@/@types/Task";
import { useOrganizationDashboard } from "@/stores/organization";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import convertToTitleCase from "@/lib/Convert";
import Link from "next/link";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  // AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const Badge = ({ task }: { task: Task }) => {
  const now = new Date();
  const badgeStyle =
    "px-2 py-1 rounded-full text-white text-xs font-semibold";

  // ✅ Completed on time
  if (task.completed && task.completedOn && task.completedOn <= task.dueDate) {
    return <span className={`${badgeStyle} bg-green-500`}>Completed</span>;
  }

  // ✅ Completed but late
  if (task.completed && task.completedOn && task.completedOn > task.dueDate) {
    return <span className={`${badgeStyle} bg-red-500`}>Completed Late</span>;
  }

  // ✅ Not completed and overdue
  if (!task.completed && now > new Date(task.dueDate)) {
    return <span className={`${badgeStyle} bg-red-500`}>Overdue</span>;
  }

  // ✅ Due today (approaching)
  const dueDate = new Date(task.dueDate);
  const isDueToday =
    dueDate.getDate() === now.getDate() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getFullYear() === now.getFullYear();

  if (!task.completed && isDueToday) {
    return <span className={`${badgeStyle} bg-yellow-500`}>Approaching</span>;
  }

  // ✅ Default pending
  return <span className={`${badgeStyle} bg-yellow-500`}>Pending</span>;
};


const Card = ({ task }: { task: Task }) => {
  const dueDate = new Date(task.dueDate);
  let completedOn = task.completedOn ? new Date(task.completedOn) : null;
  const { users } = useOrganizationDashboard();
  const requiredUser = users.find((user) => user.id === task.userId)!;

  return (
    <div
      className="bg-white cursor-pointer w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
      <div >
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2 flex flex-row items-center flex-wrap gap-[10px]">
        {convertToTitleCase(task.title)}
        <Badge task={task} />
      </h2>
      {/* <p className="text-gray-600 mb-2">{task.note}</p> */}
      <p className="text-sm text-gray-500 mb-4">{task.description}</p>

      <div className="mt-auto text-sm space-y-1">
        <p>
          <span className="font-semibold text-gray-700">Assigned to:</span>
          <Link href={`/organization/people/${requiredUser.id}`} className="text-blue-600 font-semibold"> {convertToTitleCase(requiredUser.name)}</Link>
        </p>
        {completedOn ? <p>
          <span className="font-semibold text-gray-700">Completed on:</span>
          {completedOn.toDateString()} at {completedOn.toLocaleTimeString()}
        </p> : <></>}
        <p>
          <span className="font-semibold text-gray-700">Due:</span>
          {dueDate.toDateString()} at {dueDate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

const Tasks = () => {
  const { users, tasks, addTasks, deleteTask } = useOrganizationDashboard();

  const [newTask, setnewTask] = useState({
    id: v4(),
    title: "",
    description: "",
    userId: '',
    assignedOn: new Date(),
    dueDate: new Date(),
    completed: false,
    completedOn: null
  });

  const handleCreateTask = async () => {
    try {
      const response = await axios.post("/api/tasks/create", newTask);
      addTasks(newTask);
      toast.success(response.data.message)
    } catch (err) {
      toast.error("Error while fetching")
      console.log(err);

    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await axios.delete("/api/tasks/delete", {
        data: {
          id: id,
        }
      });
      if (!response.data.success) {
        toast.error("An error occured");
      }
      deleteTask(id);
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error("An error occured");
    }
  }

  return (
    <AlertDialog>
      <main className="relative flex h-screen bg-white">
        <ManagementSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tasks Assigned</h1>

            <AlertDialogTrigger className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
              <Plus className="size-sm" />
              <span>Create</span>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>

              <form className="flex flex-col gap-[10px]">
                {/* title ... */}
                <label htmlFor="title" className="font-semibold text-sm">Title :</label>
                <input type="text" name="title" id="title" placeholder="Title" className="placeholder:text-sm py-[4px] px-[15px] rounded-md w-full" onChange={(e) => {
                  setnewTask({ ...newTask, title: e.target.value })
                }} />
                {/* description ... */}
                <label htmlFor="description" className="font-semibold text-sm">Description :</label>
                <textarea name="description" id="description" className="placeholder:text-sm py-[4px] px-[15px] h-[100px] rounded-md w-full" placeholder="Description" onChange={(e) => {
                  setnewTask({ ...newTask, description: e.target.value })
                }}></textarea>

                {/*  assigned to  ... */}
                <label htmlFor="Assigned this task to" className="font-semibold text-sm">Assigned to :</label>
                <select className="placeholder:text-sm py-[4px] px-[15px] rounded-md w-full" name="employees" id="employees" onChange={(e) => {
                  setnewTask({ ...newTask, userId: e.target.value })
                }}>
                  {
                    users.map((employee, idx) => (
                      <option value={employee.id} key={idx}>{employee.name}</option>
                    ))
                  }
                </select>
                {/* description ... */}
                <label htmlFor="Due date for this task" className="font-semibold text-sm">Due date :</label>
                <input type="datetime-local" name="dueDate" id="due-date" className="py-[4px] px-[15px] rounded-md w-full" onChange={(e) => {
                  setnewTask({ ...newTask, dueDate: new Date(e.target.value) })
                }} />
              </form>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateTask} className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
                  <Plus className="size-sm" />
                  <span>Create</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </div>

          <div className="flex flex-row flex-wrap gap-6">
            {tasks.length <= 0 ? <p className="text-gray-400">No tasks found ...</p> : tasks.map((task: Task, idx) => (
              <ContextMenu key={idx}>
                <ContextMenuTrigger>
                  <Card task={task} />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Edit</ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDeleteTask(task.id)}>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

            ))}
          </div>
        </section>
      </main>
    </AlertDialog>
  );
};

export default Tasks;