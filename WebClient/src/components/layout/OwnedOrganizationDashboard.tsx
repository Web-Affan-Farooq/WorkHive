"use client";

import { useState } from "react";
import { useOwnedOrganization } from "@/stores/ownedOrg";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  LayoutGrid,
  Settings,
  ClipboardList,
  Users,
  Building,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import Notify from "@/utils/Notifications";
import ShowClientError from "@/utils/Error";
import InviteSchema from "@/validations/InvitationSchema";

type InviteFormData = z.infer<typeof InviteSchema>;

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
      icon: <ClipboardList className="group-hover:text-white size-5" />,
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
      href: `/organization/owned/settings`,
      label: "Settings",
      icon: <Settings className="group-hover:text-white size-5" />,
    },
  ];

  const [navOpen, setNavOpen] = useState(false);
  const { name, departments, email } = useOwnedOrganization();

  const [inviteeEmail, setinviteeEmail] = useState("");
  const [departmentId, setDepartmentId] = useState(
    departments.length > 0 ? departments[0].id : ""
  );

  const invite = async () => {
    try {
      const body: InviteFormData = {
        inviteeEmail: z.email().parse(inviteeEmail),
        departmentId,
        organizationEmail: email, // 👈 use proper org email, not ID
      };
      console.log("Sending invite:", body);
      const response = await axios.post("/api/invite/send", body);
      Notify.success(response.data.message);
      setinviteeEmail("");
    } catch (err) {
      ShowClientError(err, "Invitation error");
    }
  };

  return (
    <div className="relative flex h-screen">
      {/* Sidebar */}
      <AlertDialog>
        <aside
          className={`fixed z-20 top-0 left-0 h-full bg-gray-900 text-white w-64 p-6 transform transition-transform duration-300 ease-in-out ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0`}
        >
          <nav className="flex flex-col justify-between h-full">
            <div>
              <h2 className="text-xl font-bold mb-8">{name}</h2>
              <div className="flex flex-col gap-4">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group hover:text-blue-500 transition-all duration-200 w-full ease-in-out cursor-pointer py-2 px-3 rounded-md flex flex-row items-center gap-[6px]"
                  >
                    {item.icon} <span>{item.label}</span>
                  </Link>
                ))}
                <AlertDialogTrigger className="transition-all duration-200 w-full cursor-pointer py-2 px-3 rounded-md flex flex-row items-center gap-[6px] bg-indigo-600 hover:bg-indigo-800">
                  <Plus className="size-5" />
                  <span className="font-bold">Invite</span>
                </AlertDialogTrigger>
              </div>
            </div>
            <Link href={"/dashboard"}>
              <button
                className="w-full text-left hover:text-white transition-all duration-150 ease-in-out cursor-pointer hover:bg-[var(--faun-light)] py-2 px-3 rounded-md"
                aria-label="Logout"
              >
                Your dashboard &nbsp;
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </Link>
          </nav>
        </aside>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invite employee</AlertDialogTitle>
          </AlertDialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              invite();
            }}
          >
            <div className="flex flex-col gap-[10px]">
              <label htmlFor="invitee-email" className="text-sm text-gray-500">
                Enter invitee email
              </label>
              <input
                type="email"
                id="invitee-email"
                className="px-[15px] py-[7px] rounded-md"
                onChange={(e) => setinviteeEmail(e.target.value)}
              />
            </div>

            <br />

            <div className="flex flex-col gap-[10px]">
              <label htmlFor="department" className="text-sm text-gray-500">
                Select department
              </label>
              <select
                id="department"
                className="px-[15px] py-[7px] rounded-md"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                {departments.length === 0 ? (
                  <option value="">No departments found ...</option>
                ) : (
                  departments.map((dept, idx) => (
                    <option key={idx} value={dept.id}>
                      {dept.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <br />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-indigo-600 font-bold text-white"
              >
                Invite
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
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
