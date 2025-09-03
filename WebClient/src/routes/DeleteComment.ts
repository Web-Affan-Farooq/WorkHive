import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { comments } from "@/schemas";
import { eq } from "drizzle-orm";

type DeleteCommentAPIRequest = {
  commentId: string;
};
type DeleteCommentAPIResponse = {
  message: string;
};

export type { DeleteCommentAPIRequest, DeleteCommentAPIResponse };

const DeleteComment = async (req: NextRequest) => {
  const body: DeleteCommentAPIRequest = await req.json();
  try {
    await db.delete(comments).where(eq(comments.id, body.commentId));
    return NextResponse.json({
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured while deleting comment",
      },
      {
        status: 500,
      }
    );
  }
};
export default DeleteComment;
