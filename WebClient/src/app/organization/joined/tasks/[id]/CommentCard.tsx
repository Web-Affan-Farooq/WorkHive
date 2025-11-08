"use client";
// _____ Hooks ...
import { useJoinedOrganization } from "@/stores/joinedOrg";
import { useMemo } from "react";
import { useDashboard } from "@/stores/dashboard";

// _____ Types and schemas ...
import { ExtendedComment } from "@/@types/types";
import { DeleteCommentAction } from "@/actions/comments/";

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
import { toast } from "sonner";

const CommentCard = ({ comment }: { comment: ExtendedComment }) => {
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
    const { message, success } = await DeleteCommentAction(comment.id);
    if (!success) {
      toast.error(message);
    }
    toast.success(message);
    deleteComment(comment.id);
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
                    {formatDate(comment.createdAt.toISOString())}
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
                  {formatDate(comment.createdAt.toISOString())}
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
