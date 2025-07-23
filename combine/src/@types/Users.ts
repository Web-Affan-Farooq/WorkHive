import {Task} from "./Task";
import { Organization } from "./Organization";
import { UsersOnDepartments } from "./Departments";

export interface Users {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  password: string;
  isManager: boolean;
  tasks: Task[];                      // relation
  organization?: Organization;       // relation (optional)
  organizationId: string;
  departments: UsersOnDepartments[]; // relation
}