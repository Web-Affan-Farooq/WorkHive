import { relations } from "drizzle-orm";
import { organization ,task } from "@/db/schemas";

export const organizationRelationsWithTasks = relations(
  organization,
  ({ many }) => ({
    tasks: many(task),
  })
);

export const taskRelationsWithOrganization = relations(task, ({ one }) => ({
  organization: one(organization, {
    fields: [task.organizationId],
    references: [organization.id],
  }),
}));
