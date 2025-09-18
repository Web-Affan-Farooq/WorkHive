import {
  uuid,
  boolean,
  pgTable,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { organization } from "./organizations";

export const task = pgTable("Tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  assignedOn: timestamp("assigned_on", { withTimezone: true })
    .notNull()
    .defaultNow(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  completed: boolean().notNull(),
  completedOn: timestamp("completed_on", { mode: "date" }),
  note: text(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});
