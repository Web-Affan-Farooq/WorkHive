import { uuid, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "../tables/users";
import { tasks } from "../tables/tasks";

// junction table for task and users:
export const userTaskJunction = pgTable(
  "user_tasks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({
      columns: [t.userId, t.taskId],
    }),
  })
);
// relations of user with tasks
export const userTasks = relations(users, ({ many }) => ({
  tasks: many(userTaskJunction),
}));
// relations of task with user
export const taskAssignees = relations(tasks, ({ many }) => ({
  assignees: many(userTaskJunction),
}));
// combine for many to many
export const usersTasksRelation = relations(userTaskJunction, ({ one }) => ({
  user: one(users, {
    fields: [userTaskJunction.userId],
    references: [users.id],
  }),
  task: one(tasks, {
    fields: [userTaskJunction.taskId],
    references: [tasks.id],
  }),
}));
