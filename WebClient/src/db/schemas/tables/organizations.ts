import { uuid, pgTable, varchar, text } from "drizzle-orm/pg-core";
import { user} from "./users";

export const organization = pgTable("Organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  organizationEmail: varchar("organizationEmail", { length: 30 }).notNull(),
  organizationPassword: text("organizationPassword").notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
