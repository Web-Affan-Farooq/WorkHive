import { comments, tasks, userTaskJunction } from "@/schemas";
import db from "@/db";
import { and, inArray, eq } from "drizzle-orm";

const getJoinedOrganizationTasks = async (userId: string, orgId: string) => {
  // 1. Find all taskIds for this user
  const junctions = await db
    .select({ taskId: userTaskJunction.taskId })
    .from(userTaskJunction)
    .where(eq(userTaskJunction.userId, userId));

  const taskIds = junctions.map((j) => j.taskId);

  if (taskIds.length === 0) return []; // user has no tasks

  // 2. Find all tasks that belong to the org and are in that taskIds list
  const taskList = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.organizationId, orgId), inArray(tasks.id, taskIds)));

  const userTasks = await Promise.all(
    taskList.map(async (tsk) => {
      const relatedComments = await db
        .select()
        .from(comments)
        .where(eq(comments.taskId, tsk.id));

      return {
        ...tsk,
        comments: relatedComments,
      };
    })
  );

  return userTasks;
};
export default getJoinedOrganizationTasks;
