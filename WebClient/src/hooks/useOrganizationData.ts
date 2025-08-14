import { OrganizationsData, Profile } from "@/@types/modeltypes";
import { useDashboard } from "@/stores/dashboard"
import { useEffect, useState } from "react";

const useOrganizationData = () => {
    const {selectedOrganization} = useDashboard();
    const currentOrg = selectedOrganization as OrganizationsData;
    const [allUsers, setallUsers] = useState<Profile[]>([]);

  // ✅ Move state update into useEffect to avoid infinite loop
  useEffect(() => {
    if (currentOrg?.users) {
      const usersArray: Profile[] = Object.keys(currentOrg.users).flatMap(
        (key) => currentOrg.users[key] || []
      );
      setallUsers(usersArray);
    }
  }, [currentOrg]);

    return {
        currentOrg,
        allUsers,
    }
} 
export default useOrganizationData;