"use server"
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";
import {userDepartmentsJunction, department, organization, user, notification} from "@/db/schemas";

type JoinDepartmentResponse = {
  message: string;
  success:boolean;
  redirect?: "/dashboard/organizations" | "/dashboard";
};

const JoinDepartmentAction = async (selectedDepartmentId:string):Promise<JoinDepartmentResponse> => {
  try {
    // ____ Get payload from auth token ...
    const payload = await GetTokenPayload();
    if (!payload) {
      return { message: "Unauthorized" ,success:false}
    }
    const accountId = payload.accountId;

    // ____ insert user in junction table ...
    await db
      .insert(userDepartmentsJunction)
      .values({
        userId: accountId,
        departmentId: selectedDepartmentId,
      })
      .returning();

    // ____ Find the actual department which user joins ...
    const [requiredDepartment] = await db
      .select()
      .from(department)
      .where(eq(department.id, selectedDepartmentId));

    // ____ Find the org which the requiredDepartment belongs to  ...
    const [requiredOrganization] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, requiredDepartment.organizationId));

    // ____ Find the user  ...
    const [requiredUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, accountId));

    // ____ Create a new notification on organization admin ...
    const newNotification: InferInsertModel<typeof notification> = {
      title: `A new user has joined ${requiredOrganization.name}`,
      type: "SUCCESS",
      message: `${requiredUser.name} has joined ${requiredDepartment.name} department in ${requiredOrganization.name}`,
      userId: requiredOrganization.userId,
    };

    await db.insert(notification).values(newNotification);

    return {
        message: "Organization joined successfully",
        success:true,
        redirect: "/dashboard/organizations",
      }
  } catch (err) {
    console.error("Join department error:", err);
    return { message: "An error occurred", success:false, redirect: "/dashboard" }
  }
};

export default JoinDepartmentAction;
