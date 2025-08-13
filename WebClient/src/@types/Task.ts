export interface Task {
  id: string;
  title: string;
  description: string;
  assignedOn: Date;
  dueDate: Date;
  userId: string;
  completed: boolean;
  completedOn: Date | null;
}