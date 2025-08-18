// state attached
"use client";

// ____ Libraries ...
import axios from "axios";
import toast from "react-hot-toast";

// ____ Types ...
import { Profile, OwnedOrganizationData } from "@/@types/modeltypes";

// ____ Hooks ...
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

import { useOwnedOrganization } from "@/stores/ownedOrg";

const OwnedOrganizationList = () => {
  // for getting and deleting owned organizations
  const { ownedOrganizations, feedOwnedOrganizations } = useDashboard();

  // setter function for persisting organization data accross routes
  const { setOwnedOrganization } = useOwnedOrganization();

  // ______ for counting users in each organization  ...
  const organizationUsersCount = (org: OwnedOrganizationData) => {
    const users: Profile[] = [];
    org.departments.forEach((dept) => {
      org.users[dept.id].forEach((user) => users.push(user));
    });
    return {
      users,
    };
  };

  // ______ for deleting organization ...
  const handleOrganizationDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/organizations/delete", {
        data: {
          id: id,
        },
      });
      toast.success(response.data.message);
      feedOwnedOrganizations(ownedOrganizations.filter((org) => org.id !== id));
    } catch (err) {
      console.log("Error : ", err);
      toast.error("An error occured while deleting organization");
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      {ownedOrganizations.length <= 0 ? (
        <p className="text-gray-500 py-8 text-sm text-center">
          No organizations found ...
        </p>
      ) : (
        ownedOrganizations.map((org, idx) => (
          <div
            key={idx}
            onClick={() =>
              setOwnedOrganization({
                name: org.name,
                email: org.email,
                id: org.id,
                tasks: org.tasks,
                departments: org.departments,
                users: org.users,
              })
            }
          >
            <ContextMenu>
              <ContextMenuTrigger>
                <Link href={"/organization/owned"}>
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
                        {organizationUsersCount(org).users.length} employees
                      </span>
                    </div>
                  </div>
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Edit</ContextMenuItem>
                <ContextMenuItem
                  className="text-red-500"
                  onClick={() => handleOrganizationDelete(org.id)}
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
export default OwnedOrganizationList;
