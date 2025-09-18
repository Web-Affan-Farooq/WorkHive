"use server"
import db from "@/db";
import { userDepartmentsJunction, user, organization } from "@/db/schemas";
import { eq } from "drizzle-orm";
import GetTokenPayload from "@/utils/GetTokenPayload";
import { PlanType } from "@/@types/types";

import {
  GetOrganizationUsersWithDepartment,
  GetDepartments,
  GetOrganizationUsersList,
  GetOwnedOrganizationTasks,
  GetJoinedOrganizationTasks,
} from "@/functions";

import {
  Notification,
  OwnedOrganization,
  joinedOrganization,
} from "@/@types/types";

type DashboardAPIResponse = {
  data?:{
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  notifications: Notification[];
  joinedOrganizations: joinedOrganization[];
  ownedOrganizations: OwnedOrganization[];
},
success:boolean;
message:string
};

const DashboardData = async ():Promise<DashboardAPIResponse>=> {
  const payload = await GetTokenPayload();
  if (!payload) {
    return { message: "Unauthorized",success:false };
  }

  const accountId = payload.accountId;

  const account = await db.query.user.findFirst({
    where: eq(user.id, accountId),
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
  if(!account) {
    return {message:"User not found",success:false}
  }

  const accountOrganizations = await db.query.organization.findMany({
    columns: {
      organizationPassword: false, // dont return account password to client
      userId: false, // because we are already have account id
    },
    where: eq(organization.userId, accountId),
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
        users: await GetOrganizationUsersWithDepartment(
          ownedOrganizationDepartments.map((dept) => dept.id)
        ),
        allUsers:await GetOrganizationUsersList(ownedOrg.id),
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
      const requiredJoinedOrganization = await db.query.organization.findFirst(
        {
          where: eq(organization.id, orgId),
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
      const allUsers = await GetOrganizationUsersList(orgId);
      

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
      name: account.name,
      email: account.email,
      plan: account.plan,
      notifications: account.notifications, // ignore this error
      ownedOrganizations,
      joinedOrganizations,
    };

    return {
      data:data,
      message:"",
      success:true
    }
  }
};
export default DashboardData;
