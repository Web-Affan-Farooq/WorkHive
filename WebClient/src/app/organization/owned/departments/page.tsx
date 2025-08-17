"use client";

// ___ Hooks ...
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useOwnedOrganization } from "@/stores/ownedOrg";

// ___ Libraries ...
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";

// ___ Schemas and types ...
import { Departments } from "@/@types/modeltypes";
import { DepartmentSchema } from "@/validations";

// ___ Components ...
import {
  AlertDialog,
  AlertDialogAction,
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
import Link from "next/link";
import { Plus } from "lucide-react";
import { OwnedOrganizationSidebar } from "@/components/layout";

type DepartmentFormData = z.infer<typeof DepartmentSchema>;

const DepartmentsPage = () => {
  const { id, departments, users, addDepartment, deleteDepartment } =
    useOwnedOrganization();
  // const { createDepartment } = useDashboard();

  const countEmployees = useCallback(
    (deptId: string) => {
      if (users[deptId]) return users[deptId].length;
      return 0;
    },
    [users]
  );

  const [disabled, setdisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DepartmentSchema),
    mode: "onChange",
    defaultValues: {
      organizationId: id,
    },
  });
  const handleDepartmentCreation = async (data: DepartmentFormData) => {
    setdisabled(true);
    try {
      const response = await axios.post("/api/departments/create", data);

      const newDepartment: Departments = response.data.department;
      addDepartment(newDepartment);

      toast.success(response.data.message);
      console.log(response.data);
    } catch (err) {
      console.log("Error : ", err);
      toast.error("An error occured");
    }
    setdisabled(false);
  };

  const handleDepartmentDelete = async (id: string) => {
    try {
      const response = await axios.delete("/api/departments/delete", {
        data: {
          id: id,
        },
      });
      deleteDepartment(id);
      toast.success(response.data.message);
    } catch (err) {
      console.log("Error : ", err);
      toast.error("An error occured");
    }
  };

  return (
    <AlertDialog>
      <main className="relative flex h-screen bg-white">
        <OwnedOrganizationSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Departments</h1>

            <AlertDialogTrigger className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
              <Plus className="size-sm" />
              <span>Create</span>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Create department</AlertDialogTitle>
              </AlertDialogHeader>

              <form
                className="flex flex-col gap-[10px]"
                onSubmit={handleSubmit(handleDepartmentCreation)}
              >
                {/* title ... */}
                <label htmlFor="title" className="font-semibold text-sm">
                  Name :
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="name"
                  className="placeholder:text-sm py-[4px] px-[15px] rounded-md w-full"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    disabled={disabled}
                    className={`${disabled ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900 cursor-pointer"} px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]`}
                  >
                    <Plus className="size-sm" />
                    <span>Create</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </div>

          <div>
            {departments.length <= 0 ? (
              <p className="text-gray-400">No departments found ...</p>
            ) : (
              departments.map((dept: Departments, idx: number) => (
                <div key={idx} className="w-full cursor-pointer">
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <Link href={`/organization/owned/departments/${dept.id}`}>
                        <div className="p-3 rounded-md">
                          <h1 className="text-[16px] font-bold">{dept.name}</h1>
                          <span className="text-sm text-gray-500">
                            {countEmployees(dept.id)} employees
                          </span>
                        </div>
                      </Link>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Edit</ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => handleDepartmentDelete(dept.id)}
                      >
                        Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </AlertDialog>
  );
};

export default DepartmentsPage;
