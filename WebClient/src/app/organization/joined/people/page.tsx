"use client";
import { JoinedOrganizationSidebar } from "@/components/layout";
import Link from "next/link";
import { Profile } from "@/@types/modeltypes";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Image from "next/image";
import { useJoinedOrganization } from "@/stores/joinedOrg";

const Card = ({ employeeData }: { employeeData: Profile }) => {
  return (
    <div className="flex items-center gap-4 md:px-[30px] py-2 w-full">
      {/* Profile Image */}
      <div className="flex-shrink-0">
        <div className="rounded-lg w-[45px] h-[45px] overflow-hidden">
          <Image
            src="/images/profile.jpg"
            alt={employeeData.name}
            width={90}
            height={90}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col justify-center items-start min-w-0">
        <div className="relative flex flex-row flex-nowrap justify-center items-center gap-[10px] min-w-0 w-full">
          <h4 className="text-[15px] font-bold leading-tight flex-grow">
            {employeeData.name}
          </h4>
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        </div>

        <p className="text-sm text-pink-text break-words">
          {employeeData.email}
        </p>
      </div>
    </div>
  );
};

const Peoples = () => {
  const { users } = useJoinedOrganization();

  return (
    <main className="flex h-screen bg-white">
      <JoinedOrganizationSidebar />

      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">People</h1>
        </div>
        <div>
          {users.length <= 0 ? (
            <p className="text-gray-400">
              No People for this organization found ...
            </p>
          ) : (
            users.map((employee, idx) => (
              <ContextMenu key={idx}>
                <ContextMenuTrigger>
                  <Link href={`/organization/people/${employee.id}`}>
                    <Card employeeData={employee} />
                  </Link>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Remove</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Peoples;
