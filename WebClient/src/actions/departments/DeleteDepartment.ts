"use server"
import db from "@/db";
import { department } from "@/db/schemas";
import { eq } from "drizzle-orm";

type DeleteDepartmentResponse = {
  message:string;
  success:boolean;
};

const DeleteDepartment = async (id:string):Promise<DeleteDepartmentResponse> => {
  try {
    await db.delete(department).where(eq(department.id, id));
    return {
        message: "Department deleted successfully",
        success:true
      }
  } catch (err) {
    console.log("Error : ", err);
    return {
        message: "An error occured",
        success:false
      }
  }
};
export default DeleteDepartment;
