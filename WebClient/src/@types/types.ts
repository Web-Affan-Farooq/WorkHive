// interface Department {
//   id: string;
//   name: string;
//   organizationId: string;
// }
// interface Profile {
//   id: string;
//   name: string;
//   email: string;
// }
// interface Comment {
//   id: string;
//   text: string;
//   taskId: string;
//   userId: string;
//   createdAt: Date;
// }
// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   assignedOn: Date;
//   dueDate: Date;
//   completed: boolean;
//   completedOn: Date | null;
//   note: string | null;
//   organizationId: string;
//   assignees: string[];
//   comments: Comment[];
// }

// interface OwnedOrganization {
//   id: string;
//   name: string;
//   email: string;
//   departments: Department[];
//   users: Record<string, Profile[]>;
//   tasks: Task[];
// }

// ____ Type of other user's data
interface Profile {
  id: string;
  name: string;
  email: string;
}

type PlanType = "FREE" | "TEAMS" | "PRO";

// ____ Type of tasks comments
interface Comment {
  id: string;
  text: string;
  taskId: string;
  userId: string;
  createdAt: string;
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
  comments: Comment[];
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
  comments: Comment[];
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
  users: Record<string, Profile[]>;
  tasks: TaskOwned[];
}

// ____ Type of joined organization
interface joinedOrganization {
  id: string;
  name: string;
  email: string;
  department: Department;
  users: Profile[];
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
};
