import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

interface Body {
  selectedDepartmentId: string;
}

export const POST = async (req: NextRequest) => {
  try {
    const body: Body = await req.json();
    const payload = await GetTokenPayload();

    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accountId = payload.accountId;

    await prisma.$transaction(async (tx) => {
      const joinedDepartment = await tx.department.update({
        where: {
          id: body.selectedDepartmentId,
        },
        data: {
          users: {
            connect: { id: accountId },
          },
        },
        select: {
          name: true,
          users: {
            where: { id: accountId },
            select: { name: true },
          },
          organization: {
            select: { name: true, userId: true },
          },
        },
      });

      const userName = joinedDepartment.users[0]?.name ?? "A user";

      await tx.notification.create({
        data: {
          title: `A new user has joined ${joinedDepartment.organization.name}`,
          type: "SUCCESS",
          message: `${userName} has joined ${joinedDepartment.name} department in ${joinedDepartment.organization.name}`,
          read: false,
          userId: joinedDepartment.organization.userId,
        },
      });
    });

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

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import GetTokenPayload from "@/utils/GetTokenPayload";

// interface Body {
//   selectedDepartmentId: string;
// }

// export const POST = async (req: NextRequest) => {
//   const body: Body = await req.json();
//   const payload = await GetTokenPayload();
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
//   try {
//     await prisma.$transaction(async (tx) => {
//       // ____ user joins department ...
//       const joinedDepartment = await tx.department.update({
//         where: {
//           id: body.selectedDepartmentId,
//         },
//         // ____ connect user to department ...
//         data: {
//           users: {
//             connect: {
//               id: accountId,
//             },
//           },
//         },
//         select: {
//           name: true,
//           // ____ getting new user's name ...
//           users: {
//             where: {
//               id: accountId,
//             },
//             select: {
//               name: true,
//             },
//           },

//           // ____ getting name of organization ...
//           organization: {
//             select: {
//               name: true,
//               userId: true,
//             },
//           },
//         },
//       });

//       // ____ notify organization owner about it ...
//       tx.notification.create({
//         data: {
//           title: `A new user has joined ${joinedDepartment.organization.name} `,
//           type: "SUCCESS",
//           message: `${joinedDepartment.users[0].name} has joined ${joinedDepartment.name} department in ${joinedDepartment.organization.name}`,
//           read: false,
//           userId: joinedDepartment.organization.userId,
//         },
//       });
//     });

//     return NextResponse.json({
//       message: "Organization joined successfully",
//       redirect: "/dashboard",
//     });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({
//       message: "An error occured",
//       redirect: "/dashboard",
//     });
//   }
// };
