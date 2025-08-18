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
import axios from "axios";
import ShowClientError from "@/utils/Error";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/stores/dashboard";

const LeaveOrganization = () => {
  const router = useRouter();
  const [disabled] = useState(false);
  const { info } = useDashboard();
  const { department } = useJoinedOrganization();
  if (!department) {
    return (
      <div className="p-5">
        <p className="text-sm text-gray-400">Loading ...</p>
      </div>
    );
  }
  const handleOrganizationLeave = async () => {
    try {
      const response = await axios.get("/api/departments/unjoin", {
        params: { deptId: department.id, name: info.name },
      });
      toast.success(response.data.message);
      router.push(response.data.redirect);
    } catch (err) {
      ShowClientError(err, "Leave department : ");
    }
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
