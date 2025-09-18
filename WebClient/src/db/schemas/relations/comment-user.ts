import { relations } from "drizzle-orm";
import { user ,comment } from "@/db/schemas";
export const userRelationWithComments = relations(user, ({ many }) => ({
  comments: many(comment),
}));

export const commentsRelationWithUser = relations(comment, ({ one }) => ({
  user: one(user, {
    fields: [comment.userId],
    references: [user.id],
  }),
}))
