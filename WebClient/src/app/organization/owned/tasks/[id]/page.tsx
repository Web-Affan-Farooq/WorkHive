"use client";
// ____ Hooks ...
import React from "react";
import { useMemo } from "react";
import { useOwnedOrganization } from "@/stores/ownedOrg";
import { useParams } from "next/navigation";
// ____ Components ...
import { OwnedOrganizationSidebar } from "@/components/layout";
import CommentForm from "./CommentForm";
import CommentCard from "./CommentCard";

// src/components/TaskDetails.tsx
const TaskDetails = () => {
  // _____ Hook calls ...
  const { id } = useParams();
  const { tasks } = useOwnedOrganization();

  // ____ Find task to show details ...
  const requiredTask = useMemo(() => {
    return tasks.find((t) => t.id === id)!;
  }, [tasks, id]);

  if (!requiredTask) {
    return <div>Loading</div>;
  }

  // ____ Format dates ...
  const formattedDueDate = new Date(requiredTask.dueDate).toLocaleDateString();

  if (requiredTask) {
    return (
      <main className="relative flex h-screen bg-white">
        <OwnedOrganizationSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <div className="mx-auto my-8 max-w-2xl rounded-xl bg-gray-100 p-6 shadow-lg">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                {requiredTask.title}
              </h1>
              <p className="text-gray-600">{requiredTask.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  Assigned On:
                  {new Date(requiredTask.assignedOn).toLocaleDateString()}
                </span>
                <span>Due Date: {formattedDueDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    requiredTask.completed
                      ? "bg-green-200 text-green-800"
                      : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {requiredTask.completed ? "Completed" : "In Progress"}
                </span>
                {requiredTask.completed && requiredTask.completedOn && (
                  <span className="text-sm text-gray-500">
                    Completed on:{" "}
                    {new Date(requiredTask.completedOn).toLocaleDateString()}
                  </span>
                )}
              </div>
              {requiredTask.note && (
                <p className="mt-2 rounded-md bg-gray-200 p-2 text-sm italic text-gray-700">
                  Note: {requiredTask.note}
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-gray-300 pt-6">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                Comments ({requiredTask.comments.length})
              </h2>
              <CommentForm taskId={requiredTask.id} />
              <div className="mt-4 space-y-4">
                {requiredTask.comments.length > 0 ? (
                  requiredTask.comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    No comments yet. Be the first to add one!
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }
};
export default TaskDetails;
