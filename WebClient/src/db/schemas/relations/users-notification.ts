import { relations } from "drizzle-orm";
import { user ,notification } from "@/db/schemas";

// ____ Relations between account and notifications ...
export const userRelationWithNotifications = relations(user, ({ many }) => ({
  notifications: many(notification),
}));
export const notificationsRelationWithUser = relations(
  notification,
  ({ one }) => ({
    account: one(user, {
      fields: [notification.userId],
      references: [user.id],
    }),
  })
);
