// app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // your prisma instance

interface Body {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  assignees: string[];
  dueDate: Date;
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json();
    console.log("Body : ", body);
    const task = await prisma.task.create({
      data: {
        // _____ assigning properties from client ...
        id: body.id,
        title: body.title,
        description: body.description,
        organizationId: body.organizationId,
        dueDate: body.dueDate,

        // _____  ...
        completed: false,
        completedOn: null,
        assignedOn: new Date(),
      },
      select: {
        organization: {
          select: {
            name: true,
            manager: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const notifications: {
      title: string;
      message: string;
      type: "SUCCESS" | "FAILURE";
      read: boolean;
      userId: string;
    }[] = body.assignees.map((id: string) => ({
      title: "A new task assigned to you",
      message: `You've a new task assigned by ${task.organization.manager.name} at ${task.organization.name} `,
      type: "SUCCESS",
      read: false,
      userId: id,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import GetTokenPayload from "@/utils/GetTokenPayload";
// import { Task } from "@/@types/Task";
// import { string } from "zod";

// interface TaskPayload {
//   assignedOn:Date;
// assignees
// completed
// :
// false
// completedOn
// :
// null
// description
// :
// "create landing page using eact and tailwind"
// dueDate
// :
// Fri Aug 22 2025 18:00:00 GMT-0700 (Pacific Daylight Time) {}
// note:string
// organizationId:string;
// title:string
// }

// export const POST = async (req: NextRequest) => {
//   const body: Task = await req.json();

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

//   const newTask = await prisma.task.create({
//     data: {
//       organizationId: body.organizationId,
//       // assignedTo: body.assignedTo,
//       title: body.title,
//       description: body.description,
//       assignedOn: body.assignedOn,
//       dueDate: body.dueDate,
//       completed: false,
//       completedOn: null,
//       note: body.note,
//     },
//     select: {
//       assignedTo: true,
//       organization: {
//         select: {
//           name: true,
//           manager: {
//             select: {
//               name: true,
//             },
//           },
//         },
//       },
//     },
//   });

// await prisma.notification.create({
//   data: {
//     title: "A new task assigned to you",
//     message: `You've a new task assigned by ${newTask.organization.manager.name} at ${newTask.organization.name} `,
//     type: "SUCCESS",
//     read: false,
//     userId: newTask.assignedTo,
//   },
// });

//   return NextResponse.json(
//     {
//       message: "Task created successfully",
//       task: newTask,
//     },
//     {
//       status: 201,
//     }
//   );
// };
