import { Employee } from "./Worker"

type Task = {
  id :string;
  title :string
  description :string;
  assignedOn:  string;
  dueDate     :string;
    // Many-to-many relation with users
  assignedTo: Employee;
  userId    :string;
}
export type {
    Task,
}