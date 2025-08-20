import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { JoinedOrganizationData, Profile } from "@/@types/modeltypes";
import { Department } from "@/generated/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";
import { Task } from "@/@types/Task";

export const GET = async () => {
  try {
    const payload = await GetTokenPayload();
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accountId = payload.accountId;

    // ---- Find account with owned organizations ----
    const requiredAccount = await prisma.accounts.findUnique({
      where: { id: accountId },
      select: {
        name: true,
        email: true,
        plan: true,
        organizations: {
          select: {
            id: true,
            name: true,
            organizationEmail: true,
            departments: {
              select: {
                id: true,
                name: true,
                organizationId: true,
                users: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!requiredAccount) {
      return NextResponse.json(
        { message: "Account not found" },
        { status: 404 }
      );
    }

    // ---- Owned organizations ----
    const organizations = await Promise.all(
      requiredAccount.organizations.map(async (org) => {
        const tasks: Task[] = await prisma.task.findMany({
          where: { organizationId: org.id },
        });

        const data = {
          id: org.id,
          name: org.name,
          email: org.organizationEmail,
          departments: org.departments.map((dept) => ({
            id: dept.id,
            name: dept.name,
            organizationId: dept.organizationId,
          })) as Department[],
          users: {} as Record<string, Profile[]>,
          tasks: tasks,
        };

        org.departments.forEach((dept) => {
          data.users[dept.id] = dept.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
          }));
        });

        return data;
      })
    );

    // ---- Joined organizations (via departments) ----
    const joinedDepartments = await prisma.department.findMany({
      where: {
        users: { some: { id: accountId } },
      },
      select: {
        id: true,
        name: true,
        users: { select: { id: true, name: true, email: true } },
        organizationId: true,
        organization: {
          select: { id: true, name: true, organizationEmail: true },
        },
      },
    });

    const joinedOrganizations: JoinedOrganizationData[] = await Promise.all(
      joinedDepartments.map(async (joinedDept) => {
        const tasks = await prisma.task.findMany({
          where: {
            organizationId: joinedDept.organizationId,
            assignedTo: accountId,
          },
        });

        return {
          id: joinedDept.organization.id,
          name: joinedDept.organization.name,
          email: joinedDept.organization.organizationEmail,
          department: {
            id: joinedDept.id,
            name: joinedDept.name,
            organizationId: joinedDept.organizationId,
          },
          users: joinedDept.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
          })),
          tasks: tasks as Task[],
        };
      })
    );

    // ---- Notifications ----
    const notifications = await prisma.notification.findMany({
      where: { userId: accountId },
      orderBy: { createdAt: "desc" },
    });

    // ---- Final dashboard data ----
    const dashboardData = {
      name: requiredAccount.name,
      email: requiredAccount.email,
      plan: requiredAccount.plan,
      ownedOrganizations: organizations,
      joinedOrganizations,
      notifications,
    };

    return NextResponse.json({ data: dashboardData }, { status: 200 });
  } catch (err) {
    console.error("Dashboard GET error:", err);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
};
