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
import {
  DeleteTaskAPIRequest,
  DeleteTaskAPIResponse,
} from "@/actions/tasks/DeleteTask";
// ___ Libraries ...
import axios from "axios";
// ___ Utils ...
import Notify from "@/utils/Notifications";
import ShowClientError from "@/utils/Error";

const Tasks = () => {
  const { tasks, feedTasks } = useJoinedOrganization();

  const handleDeleteTask = async (id: string) => {
    try {
      const payload: DeleteTaskAPIRequest = {
        taskId: id,
      };
      const response = await axios.delete("/api/tasks/delete", {
        data: payload,
      });
      const { data }: { data: DeleteTaskAPIResponse } = response;
      feedTasks(tasks.filter((tsk) => tsk.id !== id));
      Notify.success(data.message);
    } catch (err) {
      ShowClientError(err, "Task deletion error");
    }
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
