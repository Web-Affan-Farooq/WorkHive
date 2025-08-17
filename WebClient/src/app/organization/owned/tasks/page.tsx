"use client";

// ____ hooks ...
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useOwnedOrganization } from "@/stores/ownedOrg";

// ____ Types and schemas ...
import { TaskCreationSchema } from "@/validations";
import { Task, TaskPayload } from "@/@types/Task";

// ____ Components ...
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
import { OwnedOrganizationSidebar } from "@/components/layout";
import { Plus } from "lucide-react";
import Card from "./Card";

// ____ Libraries ...
import axios from "axios";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";

const Tasks = () => {
  const { departments, id, users, addTask, tasks, deleteTask } =
    useOwnedOrganization();

  const [selectedDepartment, setSelectedDepartment] = useState(
    departments?.[0]?.id ?? ""
  );

  const allUsers = useMemo(() => {
    return users[selectedDepartment] ?? [];
  }, [selectedDepartment, users]);

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(TaskCreationSchema),
    mode: "onChange",
    defaultValues: {
      assignedOn: new Date(),
      id: v4(),
      completed: false,
      organizationId: id,
      note: "",
      completedOn: null,
    },
  });

  const handleCreateTask = async () => {
    const data: TaskPayload = {
      id: getValues().id,
      title: getValues().title,
      description: getValues().description,
      assignedTo: getValues().assignedTo,
      note: getValues().note,
      organizationId: getValues().organizationId,
      assignedOn: getValues().assignedOn,
      dueDate: getValues().dueDate,
      completed: getValues().completed,
      completedOn: getValues().completedOn,
    };
    try {
      const response = await axios.post("/api/tasks/create", data);
      const returnedTask: Task = response.data.task;
      addTask(returnedTask);
      toast.success(response.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("An error occured");
      console.log(err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await axios.delete("/api/tasks/delete", {
        data: {
          id: id,
        },
      });
      if (!response.data.success) {
        toast.error("An error occured");
      }
      deleteTask(id);
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      toast.error("An error occured");
    }
  };

  return (
    <AlertDialog>
      <main className="relative flex h-screen bg-white">
        <OwnedOrganizationSidebar />
        <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
          <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Tasks Assigned</h1>

            <AlertDialogTrigger className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
              <Plus className="size-sm" />
              <span>Create</span>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </AlertDialogHeader>

              <form className="flex flex-col gap-[10px]">
                {/* title ... */}
                <label
                  htmlFor="title"
                  className="font-semibold text-sm"
                  id="title"
                >
                  Title :
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Title"
                  className="placeholder:text-sm py-[4px] px-[15px] rounded-md w-full"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}

                {/* description ... */}
                <label
                  htmlFor="description"
                  id="description"
                  className="font-semibold text-sm"
                >
                  Description :
                </label>
                <textarea
                  id="description"
                  className="placeholder:text-sm py-[4px] px-[15px] h-[100px] rounded-md w-full"
                  placeholder="Description"
                  {...register("description")}
                ></textarea>
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}

                {/*  choose department  ... */}
                <label
                  htmlFor="choose department"
                  className="font-semibold text-sm"
                  id="departments"
                >
                  Choose department :
                </label>
                <select
                  name="departments"
                  id="departments"
                  className="placeholder:text-sm py-[4px] px-[15px] rounded-md w-full"
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option value={dept.id} key={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                {/*  assigned to  ... */}
                <label
                  htmlFor="Assigned this task to"
                  className="font-semibold text-sm"
                  id="employees"
                >
                  Assigned to :
                </label>
                <select
                  className="placeholder:text-sm py-[4px] px-[15px] rounded-md w-full"
                  id="employees"
                  {...register("assignedTo")}
                >
                  {allUsers.length === 0 ? (
                    <option disabled>No users available</option>
                  ) : (
                    allUsers.map((employee) => (
                      <option value={employee.id} key={employee.id}>
                        {employee.name}
                      </option>
                    ))
                  )}
                </select>

                {/* due date ... */}
                <label
                  htmlFor="Due date for this task"
                  className="font-semibold text-sm"
                >
                  Due date :
                </label>
                <input
                  type="datetime-local"
                  id="due-date"
                  className="py-[4px] px-[15px] rounded-md w-full"
                  {...register("dueDate", {
                    valueAsDate: true,
                  })}
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-500">
                    {errors.dueDate.message}
                  </p>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCreateTask}
                    className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]"
                  >
                    <Plus className="size-sm" />
                    <span>Create</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </div>

          <div className="flex flex-row flex-wrap gap-6">
            {tasks.length <= 0 ? (
              <p className="text-gray-400">No tasks found ...</p>
            ) : (
              tasks.map((task: Task, idx) => (
                <ContextMenu key={idx}>
                  <ContextMenuTrigger>
                    <Card task={task} />
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    <ContextMenuItem className="cursor-pointer">
                      Edit
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="cursor-pointer"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </ContextMenuItem>
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

export default Tasks;
