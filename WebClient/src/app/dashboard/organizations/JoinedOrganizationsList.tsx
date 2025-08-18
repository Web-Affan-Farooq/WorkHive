// state attached
"use client";

// ____ Libraries ...
import axios from "axios";
import toast from "react-hot-toast";
import { useDashboard } from "@/stores/dashboard";
import { useJoinedOrganization } from "@/stores/joinedOrg";

// ____ Components ...
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Image from "next/image";
import Link from "next/link";

const JoinedOrganizationsList = () => {
  const { joinedOrganizations, feedJoinedOrganizations } = useDashboard();

  const { setJoinedOrganization, users } = useJoinedOrganization();

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
                  onClick={() => leaveOrganization(org.id)}
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
