"use server"
import db from "@/db";
import { comment } from "@/db/schemas";
import { eq } from "drizzle-orm";

type DeleteCommentAPIResponse = {
  message: string;
  success:boolean;
};

const DeleteComment = async (commentId:string):Promise<DeleteCommentAPIResponse> => {
  try {
    await db.delete(comment).where(eq(comment.id, commentId));
    return {
      message: "Comment deleted successfully",
      success:true
    }
  } catch (err) {
    console.log(err);
    return {
        message: "An error occured while deleting comment",
        success:false
      }
  }
};
export default DeleteComment;
