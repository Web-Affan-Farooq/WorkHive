"use client";
// ____ Hooks ...
import { useDashboard } from "@/stores/dashboard";
import { useJoinedOrganization } from "@/stores/joinedOrg";
// ____ Libraries ...
import axios from "axios";

// ____ Utils ...
import Notify from "@/utils/Notifications";

// ____ Components ...
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";
import Link from "next/link";
import ShowClientError from "@/utils/Error";
import {
  UnjoinDepartmentAPIRequest,
  UnjoinDepartmentAPIResponse,
} from "@/routes/UnjoinDepartment";

const JoinedOrganizationsList = () => {
  // ______ joind organinization from main state ...
  const { joinedOrganizations, feedJoinedOrganizations, info } = useDashboard();

  // ______ setter for selecting orgnaization + users array
  const { setJoinedOrganization, users } = useJoinedOrganization();

  // ______ For leaving organization ...
  const handleOrganizationLeave = async (orgId: string) => {
    try {
      const requiredOrganization = joinedOrganizations.find(
        (joinedOrg) => joinedOrg.id === orgId
      );
      if (!requiredOrganization) {
        return;
      }

      const payload: UnjoinDepartmentAPIRequest = {
        deptId: requiredOrganization.department.id,
        username: info.name,
        organizationId: requiredOrganization.department.organizationId,
      };

      const response = await axios.post("/api/departments/unjoin", payload);
      const { data }: { data: UnjoinDepartmentAPIResponse } = response;
      const remaining = joinedOrganizations.filter((org) => org.id !== orgId);
      feedJoinedOrganizations(remaining);
      Notify.success(data.message);
    } catch (err) {
      ShowClientError(err, "Leave department : ");
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {joinedOrganizations.length <= 0 ? (
        <p className="text-gray-500 py-8 text-sm text-center">
          No organizations found ...
        </p>
      ) : (
        joinedOrganizations.map((org, idx) => (
          <div key={idx} onClick={() => setJoinedOrganization(org)}>
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
                        {users.length}&nbsp; employees
                      </span>
                    </div>
                  </div>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleOrganizationLeave(org.id)}
                >
                  Leave
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
