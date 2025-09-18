"use server"
import db from "@/db";
import {
  department,
  user,
  organization,
  userDepartmentsJunction,
  notification,
} from "@/db/schemas";
import { eq, inArray, InferInsertModel } from "drizzle-orm";

type DeleteOrganizationAPIResponse = {
  message: string;
  success:boolean
};

const DeleteOrganization = async (id:string):Promise<DeleteOrganizationAPIResponse >=> {
  try {
    // 1. Get all departments for this org
    const orgDepartments = await db.query.department.findMany({
      where: eq(department.organizationId, id),
    });
    const departmentIds = orgDepartments.map((dept) => dept.id);

    if (departmentIds.length === 0) {
      // nothing to delete
      await db.delete(organization).where(eq(organization.id, id));
      return { message: "organization deleted", success:true}
    }

    // 2. Find all users in those departments (via junction)
    const usersInDepartments = await db
      .select({
        userId: user.id,
        email: user.email, // or whatever field you need
      })
      .from(userDepartmentsJunction)
      .innerJoin(user, eq(user.id, userDepartmentsJunction.userId))
      .where(inArray(userDepartmentsJunction.departmentId, departmentIds));

    const userIds = usersInDepartments.map((u) => u.userId);

    // 3. Delete the organization (cascade handles departments if set)
    await db.delete(organization).where(eq(organization.id, id));

    // 4. Notify users
    if (userIds.length > 0) {
      const newNotifications: InferInsertModel<typeof notification>[] =
        userIds.map((uid) => ({
          type: "SUCCESS",
          userId: uid,
          title: "Your organization is deleted",
          message: "Your organization has been deleted.",
        }));

      await db.insert(notification).values(newNotifications);
    }

    return {
        message: "organization deleted successfully",
        success:true
      }
  } catch (err) {
    console.error("Error : ", err);
    return {
        message: "Error occurred while deleting organization",
        success:false
      }
  }
};
export default DeleteOrganization;
