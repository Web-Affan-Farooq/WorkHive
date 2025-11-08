"use client";

import { useOwnedOrganization } from "@/stores/ownedOrg";
import { useState } from "react";

// Comment form component ...
const CommentForm = ({ taskId }: { taskId: string }) => {
  const [commentText, setCommentText] = useState("");
  const { addComment } = useOwnedOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(taskId, commentText);
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

export default CommentForm;
