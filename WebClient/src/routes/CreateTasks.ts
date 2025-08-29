// app/api/tasks/route.ts
import {
  tasks,
  userTaskJunction,
  notifications,
  organizations,
} from "@/schemas";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";

type CreateTaskRequest = {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  assignees: string[];
  dueDate: Date;
};
type CreateTaskResponse = {
  message: string;
  task: {
    id: string;
    title: string;
    description: string;
    assignedOn: Date;
    dueDate: Date;
    completed: boolean;
    completedOn: Date | null;
    note: string | null;
    organizationId: string;
    assignees: string[];
    comments: [];
  };
};

export type { CreateTaskRequest, CreateTaskResponse };

const CreateTask = async (req: NextRequest) => {
  try {
    const body: CreateTaskRequest = await req.json();
    // ______ insert task into table ...
    const [newTask] = await db
      .insert(tasks)
      .values({
        title: body.title,
        description: body.description,
        organizationId: body.organizationId,
        id: body.id,
        dueDate: new Date(),
        completed: false,
      })
      .returning();

    // ______ Find the organization which task is related ...
    const [taskOrganization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, body.organizationId));

    // ______ assign the task to users ...
    const assignees: InferInsertModel<typeof userTaskJunction>[] =
      body.assignees.map((id) => ({
        userId: id,
        taskId: newTask.id,
      }));
    await db.insert(userTaskJunction).values(assignees);

    // ______ Push reminders to users  ...
    const newNotifications: InferInsertModel<typeof notifications>[] =
      body.assignees.map((id) => ({
        title: `A new task is assigned to you`,
        type: "SUCCESS",
        userId: id,
        message: `New task is assigned to you in ${taskOrganization.name}`,
      }));
    await db.insert(notifications).values(newNotifications);

    return NextResponse.json(
      {
        message: "Task Created Successfully",
        task: {
          ...newTask,
          assignees: body.assignees,
          comments: [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error", task: null },
      { status: 500 }
    );
  }
};
export default CreateTask;
