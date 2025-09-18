import {
  uuid,
  pgTable,
  pgEnum,
  varchar,
  timestamp,
  text,
} from "drizzle-orm/pg-core";

const PlanEnum = pgEnum("Plan", ["FREE", "TEAMS", "PRO"]);

// ____ Main table for accounts ....
export const users = pgTable("Accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  plan: PlanEnum("plan").default("FREE").notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }).unique(),
  stripeSubId: varchar("stripe_sub_id", { length: 255 }).unique(),
});
