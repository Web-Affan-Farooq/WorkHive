// state attached
"use client";
import { useState } from "react";
import {
  Plus,
  LayoutGrid,
  Settings,
  ClipboardList,
  Users,
  Building,
  Bell,
  CircleCheck,
} from "lucide-react";
import Link from "next/link";
// import { useOwnedOrganization } from "@/hooks";
import { useOwnedOrganization } from "@/stores/ownedOrg";

// ___ Components ...
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ManagementSidebar = () => {
  const menuItems = [
    {
      href: `/organization/owned`,
      label: "Dashboard",
      icon: <LayoutGrid className="group-hover:text-white size-5" />,
    },
    {
      href: `/organization/owned/tasks`,
      label: "Tasks",
      icon: <ClipboardList className="group-hover:text- size-5" />,
    },
    {
      href: `/organization/owned/people`,
      label: "People",
      icon: <Users className="group-hover:text-white size-5" />,
    },
    {
      href: `/organization/owned/departments`,
      label: "Departments",
      icon: <Building className="group-hover:text-white size-5" />,
    },
    {
      href: `/organization/owned/notifications`,
      label: "Notifications",
      icon: <Bell className="group-hover:text-white size-5" />,
    },
    {
      href: `/organization/owned/settings`,
      label: "Settings",
      icon: <Settings className="group-hover:text-white size-5" />,
    },
  ];

  //   /* _____ State for toogling sidebar... */
  const [navOpen, setNavOpen] = useState(false);
  const { id, name } = useOwnedOrganization();

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <AlertDialog>
        <aside
          className={`fixed z-20 top-0 left-0 h-full bg-gray-900 text-white w-64 p-6 transform transition-transform duration-300 ease-in-out ${navOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
        >
          <nav className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold mb-8">{name}</h2>
              <div className="flex flex-col gap-4">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group hover:text-blue-500 transition-all duration-200 w-full ease-in-out cursor-pointer py-2 px-3 rounded-md flex flex-row flex-nowrap justify-start items-center gap-[6px]"
                  >
                    {item.icon} <span>{item.label}</span>
                  </Link>
                ))}
                <AlertDialogTrigger className="transition-all duration-200 w-full ease-in-out cursor-pointer py-2 px-3 rounded-md flex flex-row flex-nowrap justify-start items-center gap-[6px] bg-indigo-600 hover:bg-indigo-800">
                  <Plus className="group-hover:text-white size-5" />{" "}
                  <span className="font-bold">Invite</span>
                </AlertDialogTrigger>
              </div>
            </div>
            <Link href={"/dashboard"}>
              <button
                className="w-full text-left hover:text-white transition-all duration-150 ease-in-out cursor-pointer hover:bg-[var(--faun-light)] py-2 px-3 rounded-md"
                aria-label="Logout"
              >
                Your dashboard &nbsp;{" "}
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </Link>
          </nav>
        </aside>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite employee</AlertDialogTitle>
            <div className="mt-2 flex flex-row gap-[10px]">
              <CircleCheck className="text-green-500" />
              <span className="text-gray-500 text-sm">
                Send this id to the employees, this will be required at the time
                of joining organziation
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
      </AlertDialog>

      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-30 text-white bg-gray-900 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => setNavOpen((prev) => !prev)}
        aria-label={navOpen ? "Close menu" : "Open menu"}
      >
        {navOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25H12"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ManagementSidebar;
