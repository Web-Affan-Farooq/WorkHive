import { relations } from "drizzle-orm";
import { task ,comment } from "@/db/schemas";

export const taskCommentsRelation = relations(task, ({ many }) => ({
  comments: many(comment),
}));

export const commentsTaskRelation = relations(comment, ({ one }) => ({
  task: one(task, {
    fields: [comment.taskId],
    references: [task.id],
  }),
}))