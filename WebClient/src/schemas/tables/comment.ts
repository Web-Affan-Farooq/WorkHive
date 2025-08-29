import { uuid, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { users } from "./users";

export const comments = pgTable("Comments", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  text: varchar("text", { length: 350 }).notNull(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
