import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";
import {
  departments,
  notifications,
  organizations,
  userDepartmentsJunction,
} from "@/schemas";
import db from "@/db";
import { eq, and, InferInsertModel } from "drizzle-orm";

type UnjoinDepartmentAPIRequest = {
  deptId: string;
  username: string;
  organizationId: string;
};
type UnjoinDepartmentAPIResponse = {
  message: string;
  redirect?: "/dashboard/organizations";
};
export type { UnjoinDepartmentAPIRequest, UnjoinDepartmentAPIResponse };

const UnjoinDepartment = async (req: NextRequest) => {
  try {
    const body: UnjoinDepartmentAPIRequest = await req.json();
    const payload = await GetTokenPayload();

    // ---- Auth check ----
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ---- Dept check ----
    if (!body.deptId || !body.username) {
      return NextResponse.json(
        { message: "Incomplete data is provided" },
        { status: 400 }
      );
    }

    // ---- Disconnect user from department ----
    const [requiredDepartment] = await db
      .select()
      .from(departments)
      .where(
        and(
          eq(departments.organizationId, body.organizationId),
          eq(departments.id, body.deptId)
        )
      );

    const [requiredOrganization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, body.organizationId));

    await db
      .delete(userDepartmentsJunction)
      .where(eq(userDepartmentsJunction.userId, payload.accountId))
      .returning();

    // ---- Create notification (non-blocking if it fails) ----
    try {
      const newNotification: InferInsertModel<typeof notifications> = {
        title: `A user left organization`,
        type: "SUCCESS",
        message: `${body.username} has left the ${requiredDepartment.name} department in ${requiredOrganization.name}`,
        userId: requiredOrganization.userId,
      };
      await db.insert(notifications).values(newNotification);
    } catch (notifyErr) {
      console.error("Notification creation failed:", notifyErr);
      // Don’t block user from leaving if notification fails
    }

    // ---- Success response ----
    return NextResponse.json(
      {
        message: "Successfully left the department",
        redirect: "/dashboard/organizations",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving department:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
export default UnjoinDepartment;
