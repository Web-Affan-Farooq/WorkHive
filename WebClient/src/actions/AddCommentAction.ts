"use server"
import db from "@/db";
import { Comment,ExtendedComment } from "@/@types/types";
import { comments } from "@/db/schemas";
import GetTokenPayload from "@/utils/GetTokenPayload";

type AddCommentAPIRequest = Omit<Comment, "userId"|"id"|"createdAt">;;

type AddCommentAPIResponse = {
  message: string;
  comment: ExtendedComment;
};

export type { AddCommentAPIRequest, AddCommentAPIResponse };

const AddCommentAction = async ({taskId, text}:AddCommentAPIRequest) => {
  const payload = await GetTokenPayload();
  if (!payload) {
    return { message: "Unauthorized", success:false}
  }

  try {
    const [newComment] = await db
      .insert(comments)
      .values({
        taskId:taskId,
        userId: payload.accountId,
        text: text,
      })
      .returning();
      
      return {
        message: "An error occured",
        comment: {
            id:newComment.id,
  createdAt:newComment.createdAt,
  userEmail:payload.email,
  text:newComment.text,
  taskId:newComment.taskId
        },
      }
  } catch (err) {
    console.log(err);
    return {
        message:"An error occured"
    }
  }
};
export default AddCommentAction;