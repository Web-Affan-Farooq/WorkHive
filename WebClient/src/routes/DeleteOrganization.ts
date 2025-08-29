import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import {
  departments,
  users,
  organizations,
  userDepartmentsJunction,
  notifications,
} from "@/schemas";
import { eq, inArray, InferInsertModel } from "drizzle-orm";

type DeleteOrganizationAPIResponse = {
  message: string;
};
type DeleteOrganizationAPIRequest = {
  id: string;
};

export type { DeleteOrganizationAPIRequest, DeleteOrganizationAPIResponse };

const DeleteOrganization = async (req: NextRequest) => {
  const { id }: DeleteOrganizationAPIRequest = await req.json(); // org id
  try {
    // 1. Get all departments for this org
    const orgDepartments = await db.query.departments.findMany({
      where: eq(departments.organizationId, id),
    });
    const departmentIds = orgDepartments.map((dept) => dept.id);

    if (departmentIds.length === 0) {
      // nothing to delete
      await db.delete(organizations).where(eq(organizations.id, id));
      return NextResponse.json(
        { message: "organization deleted (no departments found)" },
        { status: 200 }
      );
    }

    // 2. Find all users in those departments (via junction)
    const usersInDepartments = await db
      .select({
        userId: users.id,
        email: users.email, // or whatever field you need
      })
      .from(userDepartmentsJunction)
      .innerJoin(users, eq(users.id, userDepartmentsJunction.userId))
      .where(inArray(userDepartmentsJunction.departmentId, departmentIds));

    const userIds = usersInDepartments.map((u) => u.userId);

    // 3. Delete the organization (cascade handles departments if set)
    await db.delete(organizations).where(eq(organizations.id, id));

    // 4. Notify users
    if (userIds.length > 0) {
      const newNotifications: InferInsertModel<typeof notifications>[] =
        userIds.map((uid) => ({
          type: "SUCCESS",
          userId: uid,
          title: "Your organization is deleted",
          message: "Your organization has been deleted.",
        }));

      await db.insert(notifications).values(newNotifications);
    }

    return NextResponse.json(
      {
        message: "organization deleted successfully",
        notifiedUsers: userIds.length,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error : ", err);
    return NextResponse.json(
      {
        message: "Error occurred while deleting organization",
      },
      { status: 500 }
    );
  }
};
export default DeleteOrganization;
