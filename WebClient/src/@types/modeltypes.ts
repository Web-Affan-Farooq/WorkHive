/*   these types are under testing cases */

import { Task } from "./Task";

/* ____ types for dashboard data  ... */
interface Accounts {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  password: string;
  plan: "FREE" | "PRO" | "TEAMS";
  stripeCustomerId: string;
  stripeSubId: string;
}
type Profile = Pick<Accounts, "id" | "name" | "email">;

// interface Organization {
//     id: string;
//     createdAt: string;
//     name: string;
//     organizationEmail: string;
//     organizationPassword: string;
//     userId: string;
//     departments: Departments[]
// }

interface Departments {
  id: string;
  name: string;
  organizationId: string;
}

interface OwnedOrganizationData {
  id: string;
  name: string;
  email: string;
  departments: Departments[];
  users: Record<string, Profile[]>;
  tasks: Task[];
}

interface JoinedOrganizationData {
  id: string;
  name: string;
  email: string;
  tasks: Task[];
  users: Profile[];
}

export type {
  Profile,
  Accounts,
  Departments,
  OwnedOrganizationData,
  JoinedOrganizationData,
};
