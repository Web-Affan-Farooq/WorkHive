import { uuid, pgTable, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const departments = pgTable("Departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
  organizationId: uuid("organizationId")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
});
