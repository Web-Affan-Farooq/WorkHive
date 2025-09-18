import { uuid, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { users } from "../tables/users";
import { departments } from "../tables/departments";

// junction table for enrolling users in departments :
export const userDepartmentsJunction = pgTable(
  "user_departments",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.departmentId] }),
  })
);

// relations of user with department
export const userDepartments = relations(users, ({ many }) => ({
  departments: many(userDepartmentsJunction),
}));
// relations of department with user
export const departmentUsers = relations(departments, ({ many }) => ({
  accounts: many(userDepartmentsJunction),
}));
// combine many to many relation
export const userDepartmentsRelation = relations(
  userDepartmentsJunction,
  ({ one }) => ({
    user: one(users, {
      fields: [userDepartmentsJunction.userId],
      references: [users.id],
    }),
    department: one(departments, {
      fields: [userDepartmentsJunction.departmentId],
      references: [departments.id],
    }),
  })
);
