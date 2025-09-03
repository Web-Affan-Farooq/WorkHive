"use client";
// _____ Hooks ...
import { useJoinedOrganization } from "@/stores/joinedOrg";
import { useMemo } from "react";
import { useDashboard } from "@/stores/dashboard";
// _____ Types and schemas ...
import { ExtendedComment } from "@/@types/types";
import type {
  DeleteCommentAPIRequest,
  DeleteCommentAPIResponse,
} from "@/routes/DeleteComment";
// _____ Libraries ...
import axios from "axios";
// _____ Components ...
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";
// _____ Utils ...
import convertToTitleCase from "@/lib/Convert";
import ShowClientError from "@/utils/Error";
import Notify from "@/utils/Notifications";

interface CommentItemProps {
  comment: ExtendedComment;
}

const CommentCard: React.FC<CommentItemProps> = ({ comment }) => {
  // Hook Calls
  const { users, deleteComment } = useJoinedOrganization();
  const { info } = useDashboard();

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

  // Find out who had commmented
  const userProfile = useMemo(() => {
    return users.find((usr) => usr.email === comment.userEmail);
  }, [users, comment.userEmail]);

  // For deleting comment
  const handleCommentDelete = async () => {
    try {
      const payload: DeleteCommentAPIRequest = {
        commentId: comment.id,
      };
      const response = await axios.delete("/api/comments/delete", {
        data: payload,
      });
      const { data }: { data: DeleteCommentAPIResponse } = response;
      Notify.success(data.message);
      deleteComment(payload.commentId);
    } catch (err) {
      ShowClientError(err, "Delete comment error");
    }
  };

  if (userProfile) {
    if (userProfile.email === info.email) {
      return (
        <ContextMenu>
          <ContextMenuTrigger className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="flex flex-row flex-nowrap items-center gap-[10px]">
                <Image
                  src={"/images/profile.jpg"}
                  alt={info.name}
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px]"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">You</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-2 text-gray-700 text-sm">{comment.text}</p>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              className="text-red-500 text-sm"
              onClick={handleCommentDelete}
            >
              Delete comment
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    } else
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            {/* <div> */}
            <div className="flex flex-row flex-nowrap items-center gap-[10px]">
              <Image
                src={"/images/profile.jpg"}
                alt={userProfile.name}
                width={30}
                height={30}
                className="w-[30px] h-[30px]"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {convertToTitleCase(userProfile.name)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
            {/* </div> */}
          </div>
          <p className="mt-2 text-gray-700 text-sm">{comment.text}</p>
        </div>
      );
  }
};
export default CommentCard;
