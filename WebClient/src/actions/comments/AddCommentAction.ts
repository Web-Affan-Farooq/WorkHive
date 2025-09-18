"use server"
import db from "@/db";
import { Comment,ExtendedComment } from "@/@types/types";
import { comment } from "@/db/schemas";
import GetTokenPayload from "@/utils/GetTokenPayload";


// ____ Types ...
type AddCommentAPIRequest = Omit<Comment, "userId"|"id"|"createdAt">;
type AddCommentAPIResponse = {
  message: string;
  success:boolean;
  comment?: ExtendedComment;
};

const AddCommentAction = async ({taskId, text}:AddCommentAPIRequest) :Promise<AddCommentAPIResponse> => {
  const payload = await GetTokenPayload();
  if (!payload) {
    return { message: "Unauthorized", success:false}
  }

  try {
    // ____ Insert the comment ...
    const [newComment] = await db
      .insert(comment)
      .values({
        taskId:taskId,
        userId: payload.accountId,
        text: text,
      })
      .returning();
      
      return {
        message: "An error occured",
        success:true,
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
        message:"An error occured",
        success:false,
    }
  }
};
export default AddCommentAction;