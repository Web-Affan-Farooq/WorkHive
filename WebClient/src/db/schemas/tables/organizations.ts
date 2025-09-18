import { uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { users } from "./users";

export const organizations = pgTable("Organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  organizationEmail: varchar("organizationEmail", { length: 30 }).notNull(),
  organizationPassword: text("organizationPassword").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
