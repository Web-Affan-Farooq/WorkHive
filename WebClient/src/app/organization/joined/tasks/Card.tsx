"use client";
// ____ Hooks  ...
import { useJoinedOrganization } from "@/stores/joinedOrg";
import { useMemo } from "react";

// ____ Utilities ...
import convertToTitleCase from "@/lib/Convert";

// ____ Types and schemas ...
import { Task } from "@/@types/Task";

// ____ Components ...
import Badge from "./Badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

const Card = ({ task }: { task: Task }) => {
  const dueDate = new Date(task.dueDate);
  const completedOn = task.completedOn ? new Date(task.completedOn) : null;
  const { users } = useJoinedOrganization();
  const requiredUser = useMemo(() => {
    return users.find((user) => user.id === task.assignedTo);
  }, [users, task]);

  if (requiredUser) {
    return (
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="bg-white cursor-pointer w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
              <div></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex flex-row items-center flex-wrap gap-[10px]">
                {convertToTitleCase(task.title)}
                <Badge task={task} />
              </h2>
              <p className="text-sm text-gray-500 mb-4">{task.description}</p>

              <div className="mt-auto text-sm space-y-1">
                {completedOn ? (
                  <p>
                    <span className="font-semibold text-gray-700">
                      Completed on:
                    </span>
                    <span className="text-sm text-gray-600">
                      {completedOn.toDateString()} at
                      {completedOn.toLocaleTimeString()}
                    </span>
                  </p>
                ) : (
                  <></>
                )}
                <p>
                  <span className="font-semibold text-gray-700">Due : </span>
                  <span className="text-sm text-gray-600">
                    {dueDate.toDateString()} at {dueDate.toLocaleTimeString()}
                  </span>
                </p>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <AlertDialogTrigger className="cursor-pointer">
                Mark done
              </AlertDialogTrigger>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add a note for manager</AlertDialogTitle>
            <AlertDialogDescription>
              <label htmlFor="Add a note for the manager">
                <textarea
                  name="note"
                  id="note"
                  className="w-full px-[20px] py-[10px]"
                ></textarea>
              </label>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer">
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

export default Card;
