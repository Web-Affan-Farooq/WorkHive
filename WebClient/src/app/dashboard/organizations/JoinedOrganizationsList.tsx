"use client";

// ____ Libraries ...
import axios from "axios";
import toast from "react-hot-toast";

// ____ Types ...
import {
  Departments,
  Profile,
  JoinedOrganizationData,
} from "@/@types/modeltypes";

// ____ Hooks ...
import { useEffect, useState } from "react";
import { useDashboard } from "@/stores/dashboard";

// ____ Components ...
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";
import Link from "next/link";
import Logger from "@/lib/logger";

// ____ extended type ...
interface DepartmentsArray extends Departments {
  users: Profile[];
}
const logger = new Logger("JoinedOrganizationList");

// ______ Custom hook laye that returns data in structured form ...
const useJoinedOrganizationUsers = (
  joinedOrganizations: JoinedOrganizationData[]
) => {
  const [users, setUsers] = useState<Record<string, Profile[]>>({});

  useEffect(() => {
    if (joinedOrganizations.length === 0) return;

    const getOrganizationUsers = async (orgId: string) => {
      try {
        const response = await axios.post("/api/departments", { orgId });
        const departments: DepartmentsArray[] = response.data.departments;

        logger.log(49, "Fetched departments:", departments);

        // Aggregate users for this organization
        setUsers((prev) => ({
          ...prev,
          [orgId]: departments.flatMap((dept) => dept.users),
        }));
      } catch (err) {
        console.log(err);
      }
    };

    Promise.all(joinedOrganizations.map((org) => getOrganizationUsers(org.id)));
  }, [joinedOrganizations]);

  return { users };
};

const JoinedOrganizationsList = () => {
  const {
    joinedOrganizations,
    setJoinedOrganization,
    feedJoinedOrganizations,
  } = useDashboard();
  const { users } = useJoinedOrganizationUsers(joinedOrganizations);

  const leaveOrganization = async (id: string) => {
    try {
      const response = await axios.get("/api/departments/unjoin", {
        params: {
          orgId: id,
        },
      });
      toast.success(response.data.message);
      feedJoinedOrganizations(
        joinedOrganizations.filter((org) => org.id !== id)
      );
    } catch (err) {
      console.log("Error : ", err);
      toast.error("An error occured while deleting organization");
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {joinedOrganizations.length <= 0 ? (
        <p className="text-gray-500 py-20 text-[18px] font-bold text-center">
          No organizations found ...
        </p>
      ) : (
        joinedOrganizations.map((org, idx) => (
          <div key={idx} onClick={() => setJoinedOrganization(org.id)}>
            <ContextMenu>
              <ContextMenuTrigger>
                <Link href={"/organization/joined"}>
                  <div className="flex flex-row flex-nowrap justify-start items-center gap-[10px] p-5 max-sm:p-2 cursor-pointer">
                    <div className="w-[40px] h-[40px] rounded-full overflow-hidden">
                      <Image
                        src={"/images/building.png"}
                        alt="image"
                        width={100}
                        height={100}
                        className="object-cover border-3 border-gray-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-indigo-700 font-bold text-[16px]">
                        {org.name}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {users[org.id].length ? users[org.id].length : 0}
                        employees
                      </span>
                    </div>
                  </div>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Edit</ContextMenuItem>
                <ContextMenuItem
                  className="text-red-500"
                  onClick={() => leaveOrganization(org.id)}
                >
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        ))
      )}
    </div>
  );
};
export default JoinedOrganizationsList;
