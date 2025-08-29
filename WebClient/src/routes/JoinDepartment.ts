import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";
import {
  organizations,
  userDepartmentsJunction,
  departments,
  users,
  notifications,
} from "@/schemas";

type JoinDepartmentRequest = {
  selectedDepartmentId: string;
};
type JoinDepartmentResponse = {
  message: string;
  redirect: "/dashboard/organizations" | "/dashboard";
};
export type { JoinDepartmentRequest, JoinDepartmentResponse };

const JoinDepartment = async (req: NextRequest) => {
  try {
    // ____ Get department id to be joined in body and payload from auth token ...
    const body: JoinDepartmentRequest = await req.json();
    const payload = await GetTokenPayload();
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const accountId = payload.accountId;

    // ____ insert user in junction table ...
    await db
      .insert(userDepartmentsJunction)
      .values({
        userId: accountId,
        departmentId: body.selectedDepartmentId,
      })
      .returning();

    // ____ Find the actual department which user joins ...
    const [requiredDepartment] = await db
      .select()
      .from(departments)
      .where(eq(departments.id, body.selectedDepartmentId));

    // ____ Find the org which the requiredDepartment belongs to  ...
    const [requiredOrganization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, requiredDepartment.organizationId));

    // ____ Find the user  ...
    const [requiredUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, accountId));

    // ____ Create a new notification on organization admin ...
    const newNotification: InferInsertModel<typeof notifications> = {
      title: `A new user has joined ${requiredOrganization.name}`,
      type: "SUCCESS",
      message: `${requiredUser.name} has joined ${requiredDepartment.name} department in ${requiredOrganization.name}`,
      userId: requiredOrganization.userId,
    };
    await db.insert(notifications).values(newNotification);

    return NextResponse.json(
      {
        message: "Organization joined successfully",
        redirect: "/dashboard/organizations",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Join department error:", err);
    return NextResponse.json(
      { message: "An error occurred", redirect: "/dashboard" },
      { status: 500 }
    );
  }
};

export default JoinDepartment;
