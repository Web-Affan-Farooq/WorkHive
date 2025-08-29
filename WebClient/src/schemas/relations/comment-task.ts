import { relations } from "drizzle-orm";

import { tasks } from "../tables/tasks";
import { comments } from "../tables/comment";
export const taskCommentsRelation = relations(tasks, ({ many }) => ({
  comments: many(comments),
}));

export const commentsTaskRelation = relations(comments, ({ one }) => ({
  task: one(tasks, {
    fields: [comments.taskId],
    references: [tasks.id],
  }),
}));
