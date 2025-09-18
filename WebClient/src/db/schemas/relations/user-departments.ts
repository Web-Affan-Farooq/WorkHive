import { uuid, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { department ,user} from "@/db/schemas";

// junction table for enrolling users in departments :
export const userDepartmentsJunction = pgTable(
  "user_departments",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    departmentId: uuid("department_id")
      .notNull()
      .references(() => department.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.departmentId] }),
  })
);

// relations of user with department
export const userDepartments = relations(user, ({ many }) => ({
  departments: many(userDepartmentsJunction),
}));
// relations of department with user
export const departmentUsers = relations(department, ({ many }) => ({
  accounts: many(userDepartmentsJunction),
}));
// combine many to many relation
export const userDepartmentsRelation = relations(
  userDepartmentsJunction,
  ({ one }) => ({
    user: one(user, {
      fields: [userDepartmentsJunction.userId],
      references: [user.id],
    }),
    department: one(department, {
      fields: [userDepartmentsJunction.departmentId],
      references: [department.id],
    }),
  })
);
