import { relations } from "drizzle-orm";
import { organizations } from "../tables/organizations";
import { departments } from "../tables/departments";
// relations between organization and its departments
export const organizationRelationWithDepartments = relations(
  organizations,
  ({ many }) => ({
    departments: many(departments),
  })
);

export const departmentsRelationWithOrganization = relations(
  departments,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [departments.organizationId],
      references: [organizations.id],
    }),
  })
);
