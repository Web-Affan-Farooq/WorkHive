import type { Task } from "./Task";
import type { Organization } from "./CreateOrganization";

type Employee = {
  id  :string;
  createdAt :string;
  updatedAt :string;
  name      :string;
  email     :string;
  password :string;
  tasks     :   Task[];
  Organization:   Organization;
  organizationId :string;

}
export type {
    Employee
}
