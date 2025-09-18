import { comment } from "@/db/schemas";
import { InferSelectModel } from "drizzle-orm";

// ____ Type of other user's data
interface Profile {
  id: string;
  name: string;
  email: string;
}

type PlanType = "FREE" | "TEAMS" | "PRO";

// ____ Type of tasks comments
type Comment = InferSelectModel<typeof comment>;

type ExtendedComment = Omit<Comment , "userId"> & {
  userEmail:string;
}

// ____ Type of tasks in joined organization
interface TasksAssigned {
  id: string;
  title: string;
  description: string;
  assignedOn: string;
  dueDate: string;
  completed: boolean;
  completedOn: string | null;
  note?: string;
  organizationId: string;
  comments: ExtendedComment[];
}
// ____ Type of tasks in owned organization
interface TaskOwned {
  id: string;
  title: string;
  description: string;
  assignedOn: string;
  dueDate: string;
  completed: boolean;
  completedOn: string | null;
  note?: string;
  organizationId: string;
  comments: ExtendedComment[];
  assignees: string[];
}
// ____ Type of department
interface Department {
  id: string;
  name: string;
  organizationId: string;
}

// enum in postgres ...
type NotificationType = "SUCCESS" | "FAILURE" | "REMINDER";

// ____ Type of notification
interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  userId: string;
}

// ____ Type of owned organization
interface OwnedOrganization {
  id: string;
  name: string;
  email: string;
  departments: Department[];
  allUsers:Omit<Profile,"id">[];
  users: Record<string, Profile[]>;
  tasks: TaskOwned[];
}

// ____ Type of joined organization
interface joinedOrganization {
  id: string;
  name: string;
  email: string;
  department: Department;
  users: Omit<Profile, "id">[];
  tasks: TasksAssigned[];
}

export type {
  Department,
  Profile,
  Comment,
  TasksAssigned,
  TaskOwned,
  Notification,
  NotificationType,
  OwnedOrganization,
  joinedOrganization,
  PlanType,
  ExtendedComment
};
