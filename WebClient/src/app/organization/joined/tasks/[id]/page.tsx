"use client";
// _____ Components ...
import { JoinedOrganizationSidebar } from "@/components/layout";

// _____ Hooks ...
import { useJoinedOrganization } from "@/stores/joinedOrg";

// _____ Utils ...
// import ShowClientError from "@/utils/Error";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { Comment, TasksAssigned } from "@/@types/types";

// src/components/CommentForm.tsx
import React, { useState } from "react";

interface CommentFormProps {
  onAddComment: (text: string) => void;
}

// Comment form component ...
const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Post
        </button>
      </div>
    </form>
  );
};

// Comment card ...
// src/components/CommentItem.tsx

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  // A simple function to format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Placeholder for a user avatar/icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
          {comment.userId.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{comment.userId}</p>
          <p className="text-xs text-gray-500">
            {formatDate(comment.createdAt)}
          </p>
        </div>
      </div>
      <p className="mt-2 text-gray-700">{comment.text}</p>
    </div>
  );
};

// src/components/TaskDetails.tsx

const TaskDetails = () => {
  const { id } = useParams();
  const { tasks } = useJoinedOrganization();

  const requiredTask = useMemo(() => {
    return tasks.find((t) => t.id === id)!;
  }, [tasks, id]);

  if (!requiredTask) {
    return <div>Loading</div>;
  }

  const handleAddComment = () => {
    return;
  };

  const formattedDueDate = new Date(requiredTask.dueDate).toLocaleDateString();

  if (requiredTask) {
    return (
      <main className="relative flex h-screen bg-white">
        <JoinedOrganizationSidebar />
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
              <CommentForm onAddComment={handleAddComment} />
              <div className="mt-4 space-y-4">
                {requiredTask.comments.length > 0 ? (
                  requiredTask.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
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
