import { uuid, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";
import { task } from "./tasks";
import { user } from "./users";

export const comment = pgTable("Comments", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  text: varchar("text", { length: 350 }).notNull(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => task.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})
