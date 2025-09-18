import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";
import { organization } from "./organizations";

export const department= pgTable("Departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});
