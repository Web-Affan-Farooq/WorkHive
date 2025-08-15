import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.nextUrl);
    const orgId = searchParams.get("orgId")!;
    const payload = await GetTokenPayload();

    // Auth check
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 402 });
    }

    // OrgId check
    if (!orgId) {
      return NextResponse.json(
        { message: "Organization ID not found" },
        { status: 400 }
      );
    }

    // Get the organization with departments and users
    const requiredOrganization = await prisma.organization.findUnique({
      where: { id: orgId },
      select: {
        departments: {
          select: {
            id: true,
            users: {
              select: { id: true },
            },
          },
        },
      },
    });

    if (!requiredOrganization) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Find the department containing the user
    const department = requiredOrganization.departments.find((dept) =>
      dept.users.some((user) => user.id === payload.accountId)
    );

    if (!department) {
      return NextResponse.json(
        { message: "User not found in any department of this organization" },
        { status: 404 }
      );
    }

    // Disconnect the user from the department
    await prisma.department.update({
      where: { id: department.id },
      data: {
        users: {
          disconnect: { id: payload.accountId },
        },
      },
    });

    return NextResponse.json(
      { message: "Successfully left the organization" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error leaving organization:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import GetTokenPayload from "@/utils/GetTokenPayload";

// export const GET = async (req: NextRequest) => {
//   const { searchParams } = new URL(req.nextUrl);
//   const orgId = searchParams.get("orgId")!;
//   const payload = await GetTokenPayload();

//   if (!payload) {
//     return NextResponse.json(
//       {
//         message: "Unauthorized",
//       },
//       {
//         status: 402,
//       }
//     );
//   }

//   if (!orgId) {
//     return NextResponse.json(
//       {
//         message: "department id not found",
//       },
//       {
//         status: 400,
//       }
//     );
//   }

//   const requiredOrganization = await prisma.organization.findUnique(
//     {
//         where: {
//             id:orgId
//         },
//         select: {
//             departments:{
//                 select: {
//                     id: true,
//                     users:{
//                         select: {
//                             id:true,
//                         }
//                     },
//                 }
//             }
//         }
//     }
//   )!;

//   requiredOrganization?.departments.find((dept) => dept.users.
//   await prisma.department.update({
//     where: {
//       id: departmentId,
//     },
//     data: {
//       users: {
//         disconnect: {
//           id: payload.accountId,
//         },
//       },
//     },
//   });

//   return NextResponse.json(
//     {
//       message: "Organization leaved",
//     },
//     {
//       status: 200,
//     }
//   );
// };
