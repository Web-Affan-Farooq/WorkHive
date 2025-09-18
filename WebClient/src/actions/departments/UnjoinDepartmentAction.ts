"use server"
import GetTokenPayload from "@/utils/GetTokenPayload";
import {
  department,
  notification,
  organization,
  userDepartmentsJunction,
} from "@/db/schemas";
import db from "@/db";
import { eq, and, InferInsertModel } from "drizzle-orm";

type UnjoinDepartmentAPIRequest = {
  deptId: string;
  username: string;
  organizationId: string;
};
type UnjoinDepartmentAPIResponse = {
  message: string;
  success:boolean;
  redirect?: "/dashboard/organizations";
};

const UnjoinDepartment = async (body:UnjoinDepartmentAPIRequest) :Promise<UnjoinDepartmentAPIResponse>=> {
  try {
    const payload = await GetTokenPayload();

    // ---- Auth check ----
    if (!payload) {
      return { message: "Unauthorized",success:false }
    }

    // ---- Disconnect user from department ----
    const [requiredDepartment] = await db
      .select()
      .from(department)
      .where(
        and(
          eq(department.organizationId, body.organizationId),
          eq(department.id, body.deptId)
        )
      );

    const [requiredOrganization] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, body.organizationId));

    await db
      .delete(userDepartmentsJunction)
      .where(eq(userDepartmentsJunction.userId, payload.accountId))
      .returning();

    // ---- Create notification (non-blocking if it fails) ----
    try {
      const newNotification: InferInsertModel<typeof notification> = {
        title: `A user left organization`,
        type: "SUCCESS",
        message: `${body.username} has left the ${requiredDepartment.name} department in ${requiredOrganization.name}`,
        userId: requiredOrganization.userId,
      };
      await db.insert(notification).values(newNotification);
    } catch (notifyErr) {
      console.error("Notification creation failed:", notifyErr);
      // Don’t block user from leaving if notification fails
    }

    // ---- Success response ----
    return {
        message: "Successfully left the department",
        success:true,
        redirect: "/dashboard/organizations",
      }
  } catch (error) {
    console.error("Error leaving department:", error);
    return { message: "Internal Server Error" ,success:false}
  }
};
export default UnjoinDepartment;
