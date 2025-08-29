import { relations } from "drizzle-orm";
import { organizations } from "../tables/organizations";
import { tasks } from "../tables/tasks";

export const organizationRelationsWithTasks = relations(
  organizations,
  ({ many }) => ({
    tasks: many(tasks),
  })
);

export const taskRelationsWithOrganization = relations(tasks, ({ one }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
}));
