import {Users} from "./Users"

export interface Department {
  id: string;
  name: string;
  users: UsersOnDepartments[];   // relation
}

export interface UsersOnDepartments {
  user: Users;             // relation
  userId: string;
  department: Department;  // relation
  departmentId: string;
}