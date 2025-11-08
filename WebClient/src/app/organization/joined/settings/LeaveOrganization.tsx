"use client";
import React, { useState } from "react";
import { useJoinedOrganization } from "@/stores/joinedOrg";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/stores/dashboard";
import { UnjoinDepartmentAction } from "@/actions/departments";
import { toast } from "sonner";

const LeaveOrganization = () => {
  const router = useRouter();
  const [disabled] = useState(false);
  const { info, feedJoinedOrganizations, joinedOrganizations } = useDashboard();
  const { department, id } = useJoinedOrganization();
  if (!department) {
    return (
      <div className="p-5">
        <p className="text-sm text-gray-400">Loading ...</p>
      </div>
    );
  }
  const handleOrganizationLeave = async () => {
    const payload = {
      deptId: department.id,
      username: info.name,
      organizationId: department.organizationId,
    };

    const { message, success, redirect } =
      await UnjoinDepartmentAction(payload);
    if (!success) {
      toast.error(message);
    }
    if (redirect) {
      router.push(redirect);
    }
    const remaining = joinedOrganizations.filter((org) => org.id !== id);
    toast.success(message);
    feedJoinedOrganizations(remaining);
  };

  return (
    <div className="p-5">
      <AlertDialog>
        <AlertDialogTrigger
          className={`${disabled ? "bg-red-700 cursor-not-allowed" : "bg-red-500 cursor-pointer"} text-white px-4 py-2 rounded-lg hover:bg-red-700`}
        >
          Leave organization
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can't be undone , All the data related to you is deleted
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel
              onClick={handleOrganizationLeave}
              className="transition hover:bg-red-500 hover:text-white cursor-pointer "
            >
              Leave
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaveOrganization;
