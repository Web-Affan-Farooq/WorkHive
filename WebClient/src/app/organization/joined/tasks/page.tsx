"use client";
// ___ Hooks ...
import React from "react";
import { useJoinedOrganization } from "@/stores/joinedOrg";
// ___ Components ...
import { JoinedOrganizationSidebar } from "@/components/layout";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Link from "next/link";
import Card from "./Card";
// ___ Types and schemas ...
import { DeleteTaskAction } from "@/actions/tasks/";
import { toast } from "sonner";

const Tasks = () => {
  const { tasks, feedTasks } = useJoinedOrganization();

  const handleDeleteTask = async (id: string) => {
    const { success, message } = await DeleteTaskAction(id);
    if (!success) {
      toast.error(message);
    }
    feedTasks(tasks.filter((tsk) => tsk.id !== id));
    toast.success(message);
  };

  return (
    <main className="relative flex h-screen bg-white">
      <JoinedOrganizationSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Assigned</h1>
        <br />
        <div className="flex flex-row flex-wrap gap-6">
          {tasks.length <= 0 ? (
            <p className="text-gray-400 text-sm">No tasks found ...</p>
          ) : (
            tasks.map((task) => (
              <Link
                href={`/organization/joined/tasks/${task.id}`}
                key={task.id}
              >
                <ContextMenu>
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
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Tasks;
