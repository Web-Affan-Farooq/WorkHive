import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Task } from "@/@types/Task";

export const POST = async (req: NextRequest) => {
  const body: Task = await req.json();
  try {
      const newTask = await prisma.task.create(
    {
      data: {
        id:body.id,
        title: body.title,
        description:body.description,
        assignedOn:body.assignedOn,
        dueDate:body.dueDate,
        completed:false,
        userId:body.userId
      }
    }
  );

  console.log("Task assigned successfully : ",newTask);
  return NextResponse.json({ message: 'Task assigned successfully', success:true})
  } catch (err) {
      return NextResponse.json({ message: 'Error occured',error:err, success:false},{status:500})
  }
}