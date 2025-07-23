import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Task } from "@/@types/Task";

export const POST = async (req: NextRequest) => {
  const body: Task = await req.json();
  const newTask = await prisma.task.create(
    {
      data: {
        title: body.title,
        description: body.description,
        dueDate: body.dueDate,
        assignedOn: body.assignedOn,
        userId: body.userId
      }
    }
  );
  console.log("Task assigned successfully : ",newTask);
  return NextResponse.json({ message: 'Task assigned successfully',  })
}