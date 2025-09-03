import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { Comment,ExtendedComment } from "@/@types/types";
import { comments } from "@/schemas";
import GetTokenPayload from "@/utils/GetTokenPayload";

type AddCommentAPIRequest = Omit<Comment, "userId"|"id"|"createdAt">;;

type AddCommentAPIResponse = {
  message: string;
  comment: ExtendedComment;
};

export type { AddCommentAPIRequest, AddCommentAPIResponse };

const AddComment = async (req: NextRequest) => {
  const body: AddCommentAPIRequest = await req.json();
  console.log(body)
  const payload = await GetTokenPayload();
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [newComment] = await db
      .insert(comments)
      .values({
        taskId: body.taskId,
        userId: payload.accountId,
        text: body.text,
      })
      .returning();
      
    return NextResponse.json(
      {
        message: "An error occured",
        comment: {
            id:newComment.id,
  createdAt:newComment.createdAt,
  userEmail:payload.email,
  text:newComment.text,
  taskId:newComment.taskId
        },
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured",
      },
      {
        status: 500,
      }
    );
  }
};
export default AddComment;
