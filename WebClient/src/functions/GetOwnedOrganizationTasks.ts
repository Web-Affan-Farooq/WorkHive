import { comment, task, userTaskJunction, user } from "@/db/schemas";
import db from "@/db";
import { inArray, eq } from "drizzle-orm";
import Logger from "@/lib/logger";

const logger = new Logger("/routes/GetOwnedOrganizationtask.ts");

const getOwnedOrganizationtask = async (organizationId:string) => {
  // 1. Find all taskIds for this user
  const orgtask = await db.select().from(task).where(eq(task.organizationId , organizationId));
  logger.log(11, "Get organization task : ",orgtask)
  
  const taskIds = orgtask.map((tsk) => tsk.id);
  logger.log(13, "Task ids : ",taskIds)
  
  const selectedcomment = await db.select(
    {
      id:comment.id,
      text:comment.text,
      taskId:comment.taskId,
      email:user.email,
      createdAt:comment.createdAt
    }
  ).from(comment)
  .leftJoin(user, eq(comment.userId, user.id))
  .where(inArray(comment.taskId, taskIds))
    
  logger.log(27, "Selected comment : ",selectedcomment)

  const selectedJunctionRows = await db.select().from(userTaskJunction).where(inArray(userTaskJunction.taskId , taskIds))
  logger.log(30, "selectedJunctionRows from userTaskJunction : ",selectedJunctionRows)
  if (taskIds.length === 0) return []; // user has no task

  // 2. Find all task that belong to the org and are in that taskIds list
  const usertask = orgtask.map((tsk) => {

    const relevantcomment = selectedcomment.filter(
      (comment) => comment.taskId === tsk.id
    );
    const requiredAssignees = selectedJunctionRows.filter((row) => row.taskId === tsk.id);

    return {
      ...tsk,
      assignees:requiredAssignees.map((ass) =>ass.userId),
      comment: relevantcomment.map((comm) => ({
        text: comm.text,
        taskId: comm.taskId,
        userEmail: comm.email, // -------------  must return "userEmail" instead of "email"
        createdAt: comm.createdAt,
        id: comm.id,
      })),
    };
  });
  return usertask;
};
export default getOwnedOrganizationtask;