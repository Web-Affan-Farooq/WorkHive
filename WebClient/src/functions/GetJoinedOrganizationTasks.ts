import { comment, task, userTaskJunction, user } from "@/db/schemas";
import db from "@/db";
import { and, inArray, eq } from "drizzle-orm";

const getJoinedOrganizationtask = async (userId: string, orgId: string) => {
  // 1. Find all taskIds for this user
  const junctions = await db
    .select({ taskId: userTaskJunction.taskId })
    .from(userTaskJunction)
    .where(eq(userTaskJunction.userId, userId));

  const taskIds = junctions.map((j) => j.taskId);

  if (taskIds.length === 0) return []; // user has no task

  // 2. Find all task that belong to the org and are in that taskIds list
  const taskList = await db
    .select()
    .from(task)
    .where(and(eq(task.organizationId, orgId), inArray(task.id, taskIds)));

  const selectedcomment = await db
    .select({
      text: comment.text,
      taskId: comment.taskId,
      email: user.email,
      createdAt: comment.createdAt,
      id: comment.id,
    })
    .from(comment)
    .innerJoin(user, eq(comment.userId, user.id))
    .where(inArray(comment.taskId, taskIds));

  const usertask = taskList.map((tsk) => {
    const relevantcomment = selectedcomment.filter(
      (comment) => comment.taskId === tsk.id
    );
    return {
      ...tsk,
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
export default getJoinedOrganizationtask;
