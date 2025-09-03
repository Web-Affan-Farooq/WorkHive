import { NextResponse } from "next/server";
import db from "@/db";
import { userDepartmentsJunction, users, organizations } from "@/schemas";
import { eq } from "drizzle-orm";
import GetTokenPayload from "@/utils/GetTokenPayload";
import { PlanType } from "@/@types/types";

import {
  GetOwnedOrganizationUsers,
  GetDepartments,
  GetJoinedOrganizationUsers,
  GetOwnedOrganizationTasks,
  GetJoinedOrganizationTasks,
} from "@/functions";

import {
  Notification,
  OwnedOrganization,
  joinedOrganization,
} from "@/@types/types";

type DashboardAPIResponse = {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  notifications: Notification[];
  joinedOrganizations: joinedOrganization[];
  ownedOrganizations: OwnedOrganization[];
};

export type { DashboardAPIResponse };

const DashboardData = async () => {
  const payload = await GetTokenPayload();
  if (!payload) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accountId = payload.accountId;

  const account = await db.query.users.findFirst({
    where: eq(users.id, accountId),
    columns: {
      createdAt: false,
      updatedAt: false,
      stripeCustomerId: false,
      stripeSubId: false,
      password: false, // dont return account password to client
    },
    with: {
      notifications: true,
      departments: true,
    },
  });

  const accountOrganizations = await db.query.organizations.findMany({
    columns: {
      organizationPassword: false, // dont return account password to client
      userId: false, // because we are already have account id
    },
    where: eq(organizations.userId, accountId),
  });

  const ownedOrganizations = await Promise.all(
    accountOrganizations.map(async (ownedOrg) => {
      const ownedOrganizationDepartments = await GetDepartments(ownedOrg.id);
      const organizationTasks = await GetOwnedOrganizationTasks(ownedOrg.id);

      const result = {
        id: ownedOrg.id,
        name: ownedOrg.name,
        email: ownedOrg.organizationEmail,
        departments: ownedOrganizationDepartments,
        users: await GetOwnedOrganizationUsers(
          ownedOrganizationDepartments.map((dept) => dept.id)
        ),
        tasks: organizationTasks,
      };
      return result;
    })
  );

  const userJoinedDepartments = await db.query.userDepartmentsJunction.findMany(
    {
      where: eq(userDepartmentsJunction.userId, accountId),
      with: {
        department: true,
      },
    }
  );

  const joinedOrganizationIds: string[] = userJoinedDepartments.map((dept) => {
    return dept.department.organizationId;
  });

  const joinedOrganizations = await Promise.all(
    joinedOrganizationIds.map(async (orgId) => {
      const requiredJoinedOrganization = await db.query.organizations.findFirst(
        {
          where: eq(organizations.id, orgId),
          columns: {
            name: true,
            organizationEmail: true,
          },
        }
      );

      const department = userJoinedDepartments.find((dept) => {
        return (
          dept.userId === accountId && dept.department.organizationId === orgId
        );
      })!;

      // ____ returns an array of all users in the joined organization ..
      const allUsers = await GetJoinedOrganizationUsers(orgId);

      // ____ returns array of all the tasks that are assigned to you  ..
      const allAssignedTasks = await GetJoinedOrganizationTasks(
        accountId,
        orgId
      );

      return {
        id: orgId,
        name: requiredJoinedOrganization?.name,
        email: requiredJoinedOrganization?.organizationEmail,
        department: department.department,
        users: allUsers,
        tasks: allAssignedTasks,
      };
    })
  );

  if (account) {
    const data = {
      id: account.id,
      name: account?.name,
      email: account?.email,
      plan: account?.plan,
      notifications: account?.notifications, // ignore this error
      ownedOrganizations,
      joinedOrganizations,
    };

    return NextResponse.json(data, { status: 200 });
  }
};
export default DashboardData;
