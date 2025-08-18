import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const deptId = searchParams.get("deptId");
    const name = searchParams.get("name");
    const payload = await GetTokenPayload();

    // ---- Auth check ----
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ---- Dept check ----
    if (!deptId) {
      return NextResponse.json(
        { message: "Department ID not provided" },
        { status: 400 }
      );
    }

    // ---- Disconnect user from department ----
    const leavedDepartment = await prisma.department.update({
      where: { id: deptId },
      data: {
        users: {
          disconnect: { id: payload.accountId },
        },
      },
      select: {
        name: true,
        organization: {
          select: {
            name: true,
            userId: true,
          },
        },
      },
    });

    // ---- Create notification (non-blocking if it fails) ----
    try {
      await prisma.notification.create({
        data: {
          title: `User left organization`,
          type: "SUCCESS",
          message: `${name ?? "A user"} has left the ${leavedDepartment.name} department in ${leavedDepartment.organization.name}`,
          read: false,
          userId: leavedDepartment.organization.userId,
        },
      });
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
