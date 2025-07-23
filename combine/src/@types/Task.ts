import {Users} from "./Users"

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedOn: Date;
  dueDate: Date;
  assignedTo: Users;       // relation
  userId: string;
  completed: boolean;
  completedOn: Date;
}