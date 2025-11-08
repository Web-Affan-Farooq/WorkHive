"use client";
// _____ Hooks ...
import { useOwnedOrganization } from "@/stores/ownedOrg";
import { useMemo } from "react";
import { useDashboard } from "@/stores/dashboard";

// _____ Types and schemas  ...
import { ExtendedComment } from "@/@types/types";

// _____ Components ...
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";

// _____ Utilities ...
import convertToTitleCase from "@/lib/Convert";

const CommentCard = ({ comment }: { comment: ExtendedComment }) => {
  const { allUsers, deleteComment } = useOwnedOrganization();
  const { info } = useDashboard();

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

  const userProfile = useMemo(() => {
    return allUsers.find((usr) => usr.email === comment.userEmail);
  }, [allUsers, comment]);

  // Fallback values
  const displayName = userProfile
    ? convertToTitleCase(userProfile.name)
    : convertToTitleCase(info.name ?? "Unknown User");
  const altText = userProfile ? userProfile.name : (info.name ?? "User");

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild className="cursor-pointer">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <Image
              src={"/images/profile.jpg"}
              alt={altText}
              width={30}
              height={30}
              className="w-[30px] h-[30px] rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">{displayName}</p>
              <p className="text-xs text-gray-500">
                {formatDate(comment.createdAt.toISOString())}
              </p>
              <p className="mt-2 text-gray-700 text-sm">{comment.text}</p>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          className="text-red-500 text-sm"
          onClick={() => deleteComment(comment.id)}
        >
          Delete comment
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CommentCard;

// "use client";
// // _____ Hooks ...
// import { useOwnedOrganization } from "@/stores/ownedOrg";
// import { useMemo } from "react";
// import { useDashboard } from "@/stores/dashboard";
// // _____ Types and schemas ...
// import { ExtendedComment } from "@/@types/types";
// import type {
//   DeleteCommentAPIRequest,
//   DeleteCommentAPIResponse,
// } from "@/routes/DeleteComment";
// // _____ Libraries ...
// import axios from "axios";
// // _____ Components ...
// import {
//   ContextMenu,
//   ContextMenuContent,
//   ContextMenuItem,
//   ContextMenuTrigger,
// } from "@/components/ui/context-menu";
// import Image from "next/image";
// // _____ Utils ...
// import convertToTitleCase from "@/lib/Convert";
// import ShowClientError from "@/utils/Error";
// import Notify from "@/utils/Notifications";

// interface CommentItemProps {
//   comment: ExtendedComment;
// }

// const CommentCard: React.FC<CommentItemProps> = ({ comment }) => {
//   // Hook Calls
//   const { allUsers, deleteComment } = useOwnedOrganization();
//   const { info } = useDashboard();

//   // A simple function to format the date
//   const formatDate = (dateString: string) => {
//     const options: Intl.DateTimeFormatOptions = {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     };
//     return new Date(dateString).toLocaleDateString("en-US", options);
//   };

//   // Find out who had commmented
//   const userProfile = useMemo(() => {
//     return allUsers.find((usr) => usr.email === comment.userEmail);
//   }, [allUsers, comment]);

//   // For deleting comment
//   const handleCommentDelete = async () => {
//     try {
//       const payload: DeleteCommentAPIRequest = {
//         commentId: comment.id,
//       };
//       const response = await axios.delete("/api/comments/delete", {
//         data: payload,
//       });
//       const { data }: { data: DeleteCommentAPIResponse } = response;
//       Notify.success(data.message);
//       deleteComment(payload.commentId);
//     } catch (err) {
//       ShowClientError(err, "Delete comment error");
//     }
//   };

//   if (!userProfile) {
//     return (
//       <ContextMenu>
//         <ContextMenuTrigger className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//           <div className="flex items-center space-x-3">
//             <div className="flex flex-row flex-nowrap items-center gap-[10px]">
//               <Image
//                 src={"/images/profile.jpg"}
//                 alt={info.name}
//                 width={30}
//                 height={30}
//                 className="w-[30px] h-[30px]"
//               />
//               <div>
//                 <p className="text-sm font-medium text-gray-900">You</p>
//                 <p className="text-xs text-gray-500">
//                   {formatDate(comment.createdAt)}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <p className="mt-2 text-gray-700 text-sm">{comment.text}</p>
//         </ContextMenuTrigger>
//         <ContextMenuContent>
//           <ContextMenuItem
//             className="text-red-500 text-sm"
//             onClick={handleCommentDelete}
//           >
//             Delete comment
//           </ContextMenuItem>
//         </ContextMenuContent>
//       </ContextMenu>
//     );
//   } else {
//     return (
//       <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//         <div className="flex items-center space-x-3">
//           <div className="flex flex-row flex-nowrap items-center gap-[10px]">
//             <Image
//               src={"/images/profile.jpg"}
//               alt={userProfile.name}
//               width={30}
//               height={30}
//               className="w-[30px] h-[30px]"
//             />
//             <div>
//               <p className="text-sm font-medium text-gray-900">
//                 {convertToTitleCase(userProfile.name)}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {formatDate(comment.createdAt)}
//               </p>
//             </div>
//           </div>
//           <p className="mt-2 text-gray-700 text-sm">{comment.text}</p>
//         </div>
//       </div>
//     );
//   }
// };
// export default CommentCard;
