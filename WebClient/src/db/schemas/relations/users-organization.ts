import { relations } from "drizzle-orm";

import { organizations } from "../tables/organizations";
import { users } from "../tables/users";

// ____ relations between accounts and organizations  ...
export const usersRelationWithOrganizations = relations(users, ({ many }) => ({
  organizations: many(organizations),
}));

export const organizationsRelationsWithUser = relations(
  organizations,
  ({ one }) => ({
    owner: one(users, {
      fields: [organizations.userId],
      references: [users.id],
    }),
  })
);
