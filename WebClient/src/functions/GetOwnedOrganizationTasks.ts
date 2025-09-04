import { comments, tasks, userTaskJunction, users } from "@/schemas";
import db from "@/db";
import { inArray, eq } from "drizzle-orm";
import Logger from "@/lib/logger";

const logger = new Logger("/routes/GetOwnedOrganizationTasks.ts");

const getOwnedOrganizationTasks = async (organizationId:string) => {
  // 1. Find all taskIds for this user
  const orgTasks = await db.select().from(tasks).where(eq(tasks.organizationId , organizationId));
  logger.log(11, "Get organization tasks : ",orgTasks)
  
  const taskIds = orgTasks.map((tsk) => tsk.id);
  logger.log(13, "Task ids : ",taskIds)
  
  const selectedComments = await db.select(
    {
      id:comments.id,
      text:comments.text,
      taskId:comments.taskId,
      email:users.email,
      createdAt:comments.createdAt
    }
  ).from(comments)
  .leftJoin(users, eq(comments.userId, users.id))
  .where(inArray(comments.taskId, taskIds))
    
  logger.log(27, "Selected comments : ",selectedComments)

  const selectedJunctionRows = await db.select().from(userTaskJunction).where(inArray(userTaskJunction.taskId , taskIds))
  logger.log(30, "selectedJunctionRows from userTaskJunction : ",selectedJunctionRows)
  if (taskIds.length === 0) return []; // user has no tasks

  // 2. Find all tasks that belong to the org and are in that taskIds list
  const userTasks = orgTasks.map((tsk) => {

    const relevantComments = selectedComments.filter(
      (comment) => comment.taskId === tsk.id
    );
    const requiredAssignees = selectedJunctionRows.filter((row) => row.taskId === tsk.id);

    return {
      ...tsk,
      assignees:requiredAssignees.map((ass) =>ass.userId),
      comments: relevantComments.map((comm) => ({
        text: comm.text,
        taskId: comm.taskId,
        userEmail: comm.email, // -------------  must return "userEmail" instead of "email"
        createdAt: comm.createdAt,
        id: comm.id,
      })),
    };
  });
  return userTasks;
};
export default getOwnedOrganizationTasks;