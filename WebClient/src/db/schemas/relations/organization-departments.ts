import { relations } from "drizzle-orm";
import { organization ,department } from "@/db/schemas";
// relations between organization and its departments
export const organizationRelationWithDepartments = relations(
  organization,
  ({ many }) => ({
    departments: many(department),
  })
);

export const departmentsRelationWithOrganization = relations(
  department,
  ({ one }) => ({
    organization: one(organization, {
      fields: [department.organizationId],
      references: [organization.id],
    }),
  })
);
