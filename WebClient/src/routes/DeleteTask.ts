import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { tasks } from "@/schemas";
import { eq } from "drizzle-orm";

type DeleteTaskAPIRequest = {
  taskId: string;
};
type DeleteTaskAPIResponse = {
  message: string;
};
export type { DeleteTaskAPIRequest, DeleteTaskAPIResponse };

const DeleteTask = async (req: NextRequest) => {
  const { taskId }: DeleteTaskAPIRequest = await req.json();
  try {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      {
        status: 200,
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
export default DeleteTask;
