import { relations } from "drizzle-orm";

import { users } from "../tables/users";
import { comments } from "../tables/comment";
export const userRelationWithComments = relations(users, ({ many }) => ({
  comments: many(comments),
}));

export const commentsRelationWithUser = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));
