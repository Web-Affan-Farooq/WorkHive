import {
  Departments,
  JoinedOrganizationData,
  Profile,
} from "@/@types/modeltypes";
import { useDashboard } from "@/stores/dashboard";
import axios from "axios";
import { useEffect } from "react";

// return users in the organization that hasbeen joined , and tasks assigned to users
interface DepartmentsArray extends Departments {
  users: Profile[];
}

const useJoinedOrganization = () => {
  const { currentOrganization, joinedOrganizations } = useDashboard();
  const organization = currentOrganization as JoinedOrganizationData;
  const organizationPeople: Profile[] = [];

  useEffect(() => {
    const getOrganizationUsers = async () => {
      const response = await axios.post("/api/departments", {
        orgId: organization.id,
      });
      const departments: DepartmentsArray[] = await response.data.departments;
      departments.forEach((dept) => {
        dept.users.forEach((user) => {
          organizationPeople.push(user);
        });
      });
    };
    getOrganizationUsers();
  }, []);

  return {
    users: organizationPeople,
    currentOrganization: organization,
    joinedOrganizations,
    // also return tasks assigned to user
  };
};
export default useJoinedOrganization;
