"use client";
// ___ Hooks ...
import React from "react";

// ___ Components ...
import { JoinedOrganizationSidebar } from "@/components/layout";
import Card from "./Card";

// ___ Types and schemas ...
import { Task } from "@/@types/Task";

// ___ Libraries ...
import axios from "axios";
import toast from "react-hot-toast";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useJoinedOrganization } from "@/stores/joinedOrg";

const Tasks = () => {
  const { tasks, feedTasks } = useJoinedOrganization();

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await axios.delete("/api/tasks/delete", {
        data: {
          id: id,
        },
      });
      feedTasks(tasks.filter((tsk) => tsk.id !== id));
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error("An error occured");
    }
  };

  return (
    <main className="relative flex h-screen bg-white">
      <JoinedOrganizationSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Assigned</h1>

        <div className="flex flex-row flex-wrap gap-6">
          {tasks.length <= 0 ? (
            <p className="text-gray-400">No tasks found ...</p>
          ) : (
            tasks.map((task: Task, idx) => (
              <ContextMenu key={idx}>
                <ContextMenuTrigger>
                  <Card task={task} />
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Edit</ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Tasks;
