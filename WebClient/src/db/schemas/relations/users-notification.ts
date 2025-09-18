import { relations } from "drizzle-orm";

import { users } from "../tables/users";
import { notifications } from "../tables/notification";

// ____ Relations between account and notifications ...
export const userRelationWithNotifications = relations(users, ({ many }) => ({
  notifications: many(notifications),
}));
export const notificationsRelationWithUser = relations(
  notifications,
  ({ one }) => ({
    account: one(users, {
      fields: [notifications.userId],
      references: [users.id],
    }),
  })
);
