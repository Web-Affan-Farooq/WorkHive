// import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Profile } from "@/@types/modeltypes";
import { Department } from "@/generated/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

export const GET = async () => {
  const payload = await GetTokenPayload();

  if (!payload) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const accountId = payload.accountId;

  const requiredAccount = await prisma.accounts.findUnique({
    where: {
      id: accountId,
    },
    select: {
      name: true,
      email: true,
      plan: true,
      organizations: true,
    },
  });

  if (!requiredAccount) {
    return NextResponse.json(
      {
        message: "Account not found",
      },
      {
        status: 404,
      }
    );
  }

  const organizations = await Promise.all(
    requiredAccount.organizations.map(async (org) => {
      const departments = await prisma.department.findMany({
        where: {
          organizationId: org.id,
        },
        select: {
          name: true,
          id: true,
          organizationId: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      const data: {
        id: string;
        name: string;
        email: string;
        departments: Department[];
        users: Record<string, Profile[]>;
      } = {
        id: org.id,
        name: org.name,
        email: org.organizationEmail,
        departments: departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
          organizationId: dept.organizationId,
        })),
        users: {},
      };
      departments.forEach((dept) => {
        data.users[dept.id] = dept.users;
      });

      return data;
    })
  );

  const joinedDepartments = await prisma.department.findMany({
    where: {
      users: {
        some: {
          id: accountId,
        },
      },
    },
  });

  const extractedOrganizations = await Promise.all(
    joinedDepartments.map(async (dept) => {
      return await prisma.organization.findUnique({
        where: {
          id: dept.organizationId,
        },
        select: {
          id: true,
          organizationEmail: true,
          name: true,
        },
      });
    })
  );

  const data = {
    name: requiredAccount.name,
    email: requiredAccount.email,
    plan: requiredAccount.plan,
    organizations: organizations,
    joinedOrganizations: extractedOrganizations,
  };

  return NextResponse.json(
    {
      data: data,
    },
    { status: 200 }
  );
};

// get account id from cookie
// after that fetch all the organizations where userId===account id you got

// then fetch each departments of each organization one by one where organizationId === loop through and get the id of organizations
