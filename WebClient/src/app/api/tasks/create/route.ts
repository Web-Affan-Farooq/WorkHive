import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";
import { TaskPayload } from "@/@types/Task";

export const POST = async (req: NextRequest) => {
  const body: TaskPayload = await req.json();

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

  const newTask = await prisma.task.create({
    data: {
      organizationId: body.organizationId,
      assignedTo: body.assignedTo,
      title: body.title,
      description: body.description,
      assignedOn: body.assignedOn,
      dueDate: body.dueDate,
      completed: false,
      completedOn: null,
      note: body.note,
    },
  });

  return NextResponse.json(
    {
      message: "Task created successfully",
      task: newTask,
    },
    {
      status: 201,
    }
  );
};
