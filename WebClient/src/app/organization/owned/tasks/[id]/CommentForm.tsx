"use client";

import { useOwnedOrganization } from "@/stores/ownedOrg";
import { useState } from "react";
import {
  AddCommentAPIRequest,
  AddCommentAPIResponse,
} from "@/routes/AddComment";
import ShowClientError from "@/utils/Error";
import Notify from "@/utils/Notifications";
import axios from "axios";

// Comment form component ...
const CommentForm = ({ taskId }: { taskId: string }) => {
  const [commentText, setCommentText] = useState("");
  const { addComment } = useOwnedOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newComment: AddCommentAPIRequest = {
      taskId: taskId,
      text: commentText,
    };
    if (commentText.trim()) {
      try {
        const response = await axios.post("/api/comments/add", newComment);
        const { data }: { data: AddCommentAPIResponse } = response;
        addComment(data.comment);
        Notify.success(data.message);
      } catch (err) {
        ShowClientError(err, "Create comment error");
      }
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
