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
        const tasks = await prisma.task.findMany({
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
          tasks: tasks as Task[],
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

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { JoinedOrganizationData, Profile } from "@/@types/modeltypes";
// import { Department } from "@/generated/prisma";
// import GetTokenPayload from "@/utils/GetTokenPayload";
// import { Task } from "@/@types/Task";

// export const GET = async () => {
//   // ____ Using customr utility for getting credentials from jwt ..
//   const payload = await GetTokenPayload();

//   // ____ Preventt unauthorized access ...
//   if (!payload) {
//     return NextResponse.json(
//       {
//         message: "Unauthorized",
//       },
//       {
//         status: 401,
//       }
//     );
//   }

//   const accountId = payload.accountId;

//   // ____ find the account ...

//   const requiredAccount = await prisma.accounts.findUnique({
//     where: {
//       id: accountId,
//     },
//     select: {
//       name: true,
//       email: true,
//       plan: true,
//       organizations: {
//         select: {
//           id: true,
//           name: true,
//           organizationEmail: true,
//           departments: {
//             select: {
//               id: true,
//               name: true,
//               organizationId: true,
//               users: {
//                 select: {
//                   name: true,
//                   email: true,
//                   id: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!requiredAccount) {
//     return NextResponse.json(
//       {
//         message: "Account not found",
//       },
//       {
//         status: 404,
//       }
//     );
//   }

//   const dashboardData = await prisma.$transaction(async (tx) => {
//     // ______ returning array of our desired format ... see OwnedOrganizationData and JoinedOrganizationData
//     const organizations: {
//       id: string;
//       name: string;
//       email: string;
//       departments: Department[];
//       users: Record<string, Profile[]>;
//       tasks: Task[];
//     }[] = await Promise.all(
//       requiredAccount.organizations.map(async (org) => {
//         const tasks = await tx.task.findMany({
//           where: {
//             organizationId: org.id,
//           },
//         });

//         const data: {
//           id: string;
//           name: string;
//           email: string;
//           departments: Department[];
//           users: Record<string, Profile[]>;
//           tasks: Task[];
//         } = {
//           id: org.id,
//           name: org.name,
//           email: org.organizationEmail,
//           departments: org.departments.map((dept) => ({
//             id: dept.id,
//             name: dept.name,
//             organizationId: dept.organizationId,
//           })),
//           users: {},
//           tasks: tasks,
//         };

//         org.departments.forEach((dept) => {
//           data.users[dept.id] = dept.users;
//         });

//         return data;
//       })
//     );

//     //  ____Extracting joined organizations , using departments table because users are nested in departments rather than indivisual organization ...
//     const joinedDepartments = await tx.department.findMany({
//       where: {
//         users: {
//           some: {
//             id: accountId,
//           },
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//         users: {
//           select: {
//             name: true,
//             email: true,
//           },
//         },
//         organizationId: true,
//         organization: {
//           select: {
//             id: true,
//             name: true,
//             organizationEmail: true,
//           },
//         },
//       },
//     });

//     const allFelloUsers: Omit<Profile, "id">[] = [];

//     const joinedOrganizationsWithoutUsers: Omit<
//       JoinedOrganizationData,
//       "users"
//     >[] = await Promise.all(
//       joinedDepartments.map(async (joinedDept) => {
//         const tasks: Task[] = await tx.task.findMany({
//           where: {
//             organizationId: joinedDept.organizationId,
//             assignedTo: accountId,
//           },
//           select: {
//             title: true,
//             organizationId: true,
//             assignedTo: true,
//             assignedOn: true,
//             note: true,
//             completedOn: true,
//             completed: true,
//             dueDate: true,
//             description: true,
//             id: true,
//           },
//         });
//         joinedDept.users.forEach((user) => allFelloUsers.push(user));

//         return {
//           id: joinedDept.organization.id,
//           name: joinedDept.organization.name,
//           email: joinedDept.organization.organizationEmail,
//           department: {
//             id: joinedDept.id,
//             name: joinedDept.name,
//             organizationId: joinedDept.organizationId,
//           },
//           tasks: tasks,
//         };
//       })
//     );

//     const joinedOrganizations: JoinedOrganizationData[] =
//       joinedOrganizationsWithoutUsers.map((joinedOrg) => {
//         return { ...joinedOrg, users: allFelloUsers };
//       });

//     //  _____ Getting account notifications ...
//     const notifications = await tx.notification.findMany({
//       where: {
//         userId: accountId,
//       },
//     });

//     const data = {
//       name: requiredAccount.name,
//       email: requiredAccount.email,
//       plan: requiredAccount.plan,
//       ownedOrganizations: organizations,
//       joinedOrganizations: joinedOrganizations,
//       notifications: notifications,
//     };

//     return data;
//   });

//   return NextResponse.json(
//     {
//       data: dashboardData,
//     },
//     { status: 200 }
//   );
// };
