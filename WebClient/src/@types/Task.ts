// interface Task {
//   id: string;
//   title: string;
//   description: string;
//   assignedOn: string;
//   dueDate: string;
//   organizationId: string;
//   assignedTo: string;
//   completed: boolean;
//   completedOn: string | null;
//   note: string;
// }

interface Task {
  id: string;
  title: string;
  description: string;
  assignedOn: Date;
  dueDate: Date;
  organizationId: string;
  assignedTo: string;
  completed: boolean;
  completedOn: Date | null;
  note: string;
}

export type { Task };
