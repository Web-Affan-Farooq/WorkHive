import { uuid, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user ,task } from "@/db/schemas";

// junction table for task and users:
export const userTaskJunction = pgTable(
  "user_tasks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => task.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userId, t.taskId],
    }),
  })
);
// relations of user with tasks
export const userTasks = relations(user, ({ many }) => ({
  tasks: many(userTaskJunction),
}));
// relations of task with user
export const taskAssignees = relations(task, ({ many }) => ({
  assignees: many(userTaskJunction),
}));
// combine for many to many
export const usersTasksRelation = relations(userTaskJunction, ({ one }) => ({
  user: one(user, {
    fields: [userTaskJunction.userId],
    references: [user.id],
  }),
  task: one(task, {
    fields: [userTaskJunction.taskId],
    references: [task.id],
  }),
}));
