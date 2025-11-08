"use client";
import { OwnedOrganizationSidebar } from "@/components/layout";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { Profile } from "@/@types/modeltypes";
import { useOwnedOrganization } from "@/stores/ownedOrg";

import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  // AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import Image from "next/image";
import { useMemo } from "react";
import Logger from "@/lib/logger";

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
        {/* <div className="relative flex flex-row flex-nowrap justify-center items-center gap-[10px]">
                <h4 className="text-white text-md font-bold leading-tight truncate">Mdfu ifuiods ff dsfidsopfi ad Affan</h4>
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                </div> */}
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

const logger = new Logger("/organization/owned/people/page.tsx");
const Peoples = () => {
  const { id, users } = useOwnedOrganization();

  const allUsers = useMemo(() => {
    if (users) {
      const usersArray: Profile[] = Object.keys(users).flatMap(
        (key) => users[key] || []
      );
      logger.log(17, " users array after flat :  ", usersArray);
      return usersArray;
    }
    return [];
  }, [users]);

  return (
    <AlertDialog>
      <main className="flex h-screen bg-white">
        <OwnedOrganizationSidebar />

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite employee</AlertDialogTitle>
            <div className="mt-2 flex flex-row flex-wrap justify-center items-start gap-[10px]">
              <CircleCheck className="text-green-500" />
              <span className="text-gray-500 text-sm">
                Send this id to the employees, this will be required for login
              </span>
            </div>
          </AlertDialogHeader>
          <div className="p-[5px]">
            <div className="flex flex-row gap-[10px] items-center">
              <div className="bg-gray-800/90 text-gray-400 px-[15px] py-[5px] rounded-md truncate w-full">
                {id}
              </div>
              <button
                type="button"
                className="bg-gray-400 px-[10px] py-[1px] rounded-md"
                onClick={(e) => {
                  window.navigator.clipboard.writeText(id);
                  e.currentTarget.innerText = "Copied";
                }}
              >
                copy
              </button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full">Cancel</AlertDialogCancel>
            {/* <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>

        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">People</h1>
            <AlertDialogTrigger
              type="button"
              className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]"
            >
              <Plus className="size-sm" />
              <span>Invite</span>
            </AlertDialogTrigger>
          </div>
          <div>
            {allUsers.length <= 0 ? (
              <p className="text-gray-400">
                No People for this organization found ...
              </p>
            ) : (
              allUsers.map((employee, idx) => (
                <ContextMenu key={idx}>
                  <ContextMenuTrigger>
                    <Link href={`/organization/owned/people/${employee.id}`}>
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
    </AlertDialog>
  );
};

export default Peoples;
