"use server"
import {
  task,
  userTaskJunction,
  notification,
  organization,
} from "@/db/schemas";
import db from "@/db";
import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

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
  success:boolean;
  task?: InferSelectModel<typeof task> & {
    assignees: string[];
    comments: [];
  };
};

const CreateTaskAction = async (body:CreateTaskRequest):Promise<CreateTaskResponse> => {
  try {
    // ______ insert task into table ...
    const [newTask] = await db
      .insert(task)
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
      .from(organization)
      .where(eq(organization.id, body.organizationId));

    // ______ assign the task to users ...
    const assignees: InferInsertModel<typeof userTaskJunction>[] =
      body.assignees.map((id) => ({
        userId: id,
        taskId: newTask.id,
      }));
    await db.insert(userTaskJunction).values(assignees);

    // ______ Push reminders to users  ...
    const newNotifications: InferInsertModel<typeof notification>[] =
      body.assignees.map((id) => ({
        title: `A new task is assigned to you`,
        type: "SUCCESS",
        userId: id,
        message: `New task is assigned to you in ${taskOrganization.name}`,
      }));
    await db.insert(notification).values(newNotifications);

    return {
        message: "Task Created Successfully",
        success:true,
        task: {
          ...newTask,
          assignees: body.assignees,
          comments: [],
        },
      }
  } catch (error) {
    console.error(error);
    return { message: "Internal Server Error", success:false }
  }
};
export default CreateTaskAction;
