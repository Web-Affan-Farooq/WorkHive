"use client";
// ____ Hooks  ...
import { useJoinedOrganization } from "@/stores/joinedOrg";
import { useMemo, useState } from "react";

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
import ShowClientError from "@/utils/Error";
import axios from "axios";
import { useDashboard } from "@/stores/dashboard";
import Notify from "@/utils/Notifications";

interface Payload {
  taskId: string;
  note: string;
  name: string;
  departmentName: string;
  organizationName: string;
}

const Card = ({ task }: { task: Task }) => {
  const dueDate = new Date(task.dueDate);
  const [loading, setLoading] = useState(false);
  const completedOn = task.completedOn ? new Date(task.completedOn) : null;
  const { users, department, name, feedTasks, tasks } = useJoinedOrganization();
  const { info } = useDashboard();
  const requiredUser = useMemo(() => {
    return users.find((user) => user.id === task.assignedTo);
  }, [users, task]);

  const [note, setNote] = useState("");

  const markAsDone = async () => {
    setLoading(true);
    if (!department) return;

    try {
      const data: Payload = {
        taskId: task.id,
        note: note,
        departmentName: department.id,
        organizationName: name,
        name: info.name,
      };
      const response = await axios.post("/api/tasks/mark-done", data);
      Notify.success(response.data.message);
      const updatedList = tasks.map((tsk) => {
        if (tsk.id === data.taskId) {
          return {
            ...tsk,
            completedOn: response.data.completedOn,
            completed: true,
            note: response.data.note,
          };
        } else return tsk;
      });
      feedTasks(updatedList);
    } catch (err) {
      ShowClientError(err, "Mark as done error");
    }
    setLoading(false);
  };

  if (requiredUser) {
    return loading ? (
      <p className="text-sm text-gray-500">Loading ...</p>
    ) : (
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
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
              </label>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer" onClick={markAsDone}>
              Done
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

export default Card;
