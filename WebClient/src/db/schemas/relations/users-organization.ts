import { relations } from "drizzle-orm";
import { organization ,user } from "@/db/schemas";

// ____ relations between accounts and organizations  ...
export const usersRelationWithOrganizations = relations(user, ({ many }) => ({
  organizations: many(organization),
}));

export const organizationsRelationsWithUser = relations(
  organization,
  ({ one }) => ({
    owner: one(user, {
      fields: [organization.userId],
      references: [user.id],
    }),
  })
);
