import { comments, tasks, userTaskJunction, users } from "@/schemas";
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

  const selectedComments = await db
    .select({
      text: comments.text,
      taskId: comments.taskId,
      email: users.email,
      createdAt: comments.createdAt,
      id: comments.id,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(inArray(comments.taskId, taskIds));

  const userTasks = taskList.map((tsk) => {
    const relevantComments = selectedComments.filter(
      (comment) => comment.taskId === tsk.id
    );
    return {
      ...tsk,
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
export default getJoinedOrganizationTasks;
