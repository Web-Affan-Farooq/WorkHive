import {
  uuid,
  pgTable,
  pgEnum,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// ✅ Step 1: Define Enum separately
export const notificationTypeEnum = pgEnum("NotificationType", [
  "SUCCESS",
  "FAILURE",
  "REMINDER",
]);

// ✅ Step 2: Use Enum in table
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 100 }).notNull(),
  message: varchar("message", { length: 255 }).notNull(),
  type: notificationTypeEnum("type").notNull(), // ✅ correct usage
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  read: boolean().default(false),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
