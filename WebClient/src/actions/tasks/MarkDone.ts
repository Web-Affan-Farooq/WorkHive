"use server"
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";
import { notification, organization, task } from "@/db/schemas";

type MarkDoneRequest = {
  taskId: string;
  note: string;
  name: string;
  departmentName: string;
  organizationName: string;
};
type MarkAsDoneResponse = {
  message: string;
  success:boolean
};

const MarkAsDoneAction = async (body:MarkDoneRequest):Promise<MarkAsDoneResponse> => {
  const payload = await GetTokenPayload();
  if (!payload) {
    return {
        message: "Unauthorized",
        success:false
      }
  }

  try {
    const [completedTask] = await db
      .update(task)
      .set({
        completed: true,
        completedOn: new Date(),
        note: body.note,
      })
      .returning();
    const [requiredOrganization] = await db
      .select()
      .from(organization)
      .where(eq(organization.id, completedTask.organizationId));

    const dueDate = new Date(completedTask.dueDate);

    if (completedTask.completedOn && dueDate < completedTask.completedOn) {
      const newNotification: InferInsertModel<typeof notification> = {
        title: "Late task submission ",
        message: `late task submission from ${body.name} belongs to ${body.departmentName} department of ${body.organizationName}`,
        type: "SUCCESS",
        userId: requiredOrganization.userId,
      };
      await db.insert(notification).values(newNotification);
    } else {
      const newNotification: InferInsertModel<typeof notification> = {
        title: "New task submission ",
        message: `${body.name} has completed the given task , now waiting for review . Check ${body.departmentName} department of ${requiredOrganization.name}`,
        type: "SUCCESS",
        userId: payload.accountId,
      };
      await db.insert(notification).values(newNotification);
    }
    return {
        message: "Marked as done",
        success:true,
      }
  } catch (err) {
    console.log(err);
    return {
        message: "An error occured",
        success:false
      }
  }
};
export default MarkAsDoneAction;
