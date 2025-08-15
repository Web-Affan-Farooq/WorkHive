"use client";
import React, { useState } from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const DeleteOrganization = () => {
  const [disabled] = useState(false);

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger className={`${disabled ? "bg-red-700 cursor-not-allowed" : "bg-red-500 cursor-pointer"} text-white px-4 py-2 rounded-lg hover:bg-red-700`}>
          Delete organization</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action can't be undone , All the data related to you and your organizations can be deleted</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel className='transition hover:bg-red-500 hover:text-white cursor-pointer ' >Delete</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteOrganization
