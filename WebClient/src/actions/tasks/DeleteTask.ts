"use server"
import db from "@/db";
import { task } from "@/db/schemas";
import { eq } from "drizzle-orm";

type DeleteTaskAPIResponse = {
  message: string;
  success:boolean
};

const DeleteTask = async (taskId:string):Promise<DeleteTaskAPIResponse> => {
  try {
    await db.delete(task).where(eq(task.id, taskId));
    return {
        message: "Task deleted successfully",
        success:true,
      }
  } catch (err) {
    console.log(err);
    return {
        message: "An error occured",
        success:false
      }
  }
};
export default DeleteTask;
