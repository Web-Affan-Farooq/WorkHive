import db from "@/db";
import Logger from "@/lib/logger";
import { tasks, comments, userTaskJunction } from "@/schemas";
import { eq } from "drizzle-orm";

const logger = new Logger("GetOwnedOrganizationTasks.ts");

const getOwnedOrganizationTasks = async (organizationId: string) => {
  const organizationRelatedtasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.organizationId, organizationId));
  const results = await Promise.all(
    organizationRelatedtasks.map(async (task) => {
      const assignees: string[] = (
        await db
          .select()
          .from(userTaskJunction)
          .where(eq(userTaskJunction.taskId, task.id))
      ).map(({ userId }) => userId);

      const taskComments = await db
        .select()
        .from(comments)
        .where(eq(comments.taskId, task.id));

      return {
        ...task,
        assignees,
        comments: taskComments,
      };
    })
  );
  return results;
};
export default getOwnedOrganizationTasks;
