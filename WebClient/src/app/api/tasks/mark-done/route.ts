// _____ /api/tasks/mark-done ...
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

interface Body {
  taskId: string;
  note: string;
  name: string;
  departmentName: string;
  organizationName: string;
}

export const POST = async (req: NextRequest) => {
  const body: Body = await req.json();
  const payload = await GetTokenPayload();
  if (!payload) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 402,
      }
    );
  }

  try {
    await prisma.$transaction(async (tsx) => {
      const completedTask = await tsx.task.update({
        where: {
          id: body.taskId,
        },
        data: {
          completed: true,
          completedOn: new Date(),
          note: body.note,
        },
      });

      const dueDate = new Date(completedTask.dueDate);
      if (completedTask.completedOn && dueDate < completedTask.completedOn) {
        await tsx.notification.create({
          data: {
            title: "Late task submission ",
            message: `late task submission from ${body.name} belongs to ${body.departmentName} department of ${body.organizationName}`,
            type: "SUCCESS",
            userId: payload.accountId,
          },
        });
      } else {
        await tsx.notification.create({
          data: {
            title: "New task submission ",
            message: `${body.name} has completed the given task , now waiting for review . Check ${body.departmentName} department of ${body.organizationName}`,
            type: "SUCCESS",
            userId: payload.accountId,
          },
        });
      }
    });

    return NextResponse.json(
      {
        message: "Marked as done",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured",
      },
      {
        status: 500,
      }
    );
  }
};
