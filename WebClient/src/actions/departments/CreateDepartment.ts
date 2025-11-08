"use server"
import db from "@/db";
import { department } from "@/db/schemas";

type CreateDepartmentRequest = {
  name: string;
  organizationId: string;
};
type CreateDepartmentResponse = {
  message: string;
  success:boolean;
  department?: {
    name: string;
    id: string;
    organizationId: string;
  };
};

const CreateDepartmentAction = async (body: CreateDepartmentRequest ) :Promise<CreateDepartmentResponse>=> {
  try {
    const [newDepartment] = await db
      .insert(department)
      .values(body)
      .returning();

    return{
        message: "department created successfully",
        success:true,
        department: newDepartment,
      }
  } catch (err) {
    console.log("Error : ", err);
    return {
        message: "An error occured",
        success:false
      }
  }
};
export default CreateDepartmentAction;
