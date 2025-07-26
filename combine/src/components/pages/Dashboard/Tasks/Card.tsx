import { Task } from "@/@types/Task";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import toast from "react-hot-toast";
import { useEmployeeDashboard } from "@/stores/dashboard";


const Card = ({ task }: { task: Task }) => {
  const { markAsDone } = useEmployeeDashboard();

  const [data, setData] = useState<{
    id: string;
    note: string;
    completedOn: Date,
  }>(
    {
      id: task.id,
      note: "",
      completedOn: new Date()
    }
  );

  const times = {
    dueDate: new Date(task.dueDate),
  }
  const handleMarkAsDone = async () => {
    try {
      if (data.note !== "") {
        const response = await axios.post(`/api/tasks/mark-done`, data);
        if (!response.data.success) {
          toast.error(response.data.message)
        }
        markAsDone(response.data.task)
        toast.success("Marked as done")
      }
    } catch (err) {
      console.log(err);
      toast.success("An error occured")
    }
  }

  return (
    <AlertDialog>
      <div
        className="cursor-pointer bg-white w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {task.title}
        </h2>
        <span
          className={`absolute top-7 right-7 px-2 py-1 rounded-full text-white text-xs font-semibold ${task.completed
            ? "bg-green-500" : "bg-yellow-500"}`}
        >
          {task.completed ? "Completed" : "Pending"}
        </span>

        {/* <p className="text-gray-600 mb-2">{task.note}</p> */}
        <p className="text-sm text-gray-500 mb-4">{task.description}</p>

        <div className="mt-auto text-sm space-y-1">
          <p>
            <span className="font-semibold text-gray-700">Due:</span>{" "}
            {times.dueDate.toDateString()} at {times.dueDate.toLocaleTimeString()}
          </p>
          <AlertDialogTrigger
            onClick={handleMarkAsDone}
            className={`bg-blue-500 cursor-pointer px-2 py-1 rounded-full text-white text-xs font-semibold ${task.completed
              ? "hidden" : ""}`}
          >
            Mark as done
          </AlertDialogTrigger>
        </div>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently marked as done .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <label htmlFor="Add a note">Add a note of submission</label>
        <textarea name="note" id="note" className="rounded-lg h-[100px] border border-black px-[10px] py-[5px]" onChange={(e) => {
          setData({ ...data, note: e.target.value })
        }}></textarea>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMarkAsDone}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  )
}
export default Card;