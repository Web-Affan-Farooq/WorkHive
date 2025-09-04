"use client";

import convertToTitleCase from "@/lib/Convert";
import Badge from "./Badge";
import Link from "next/link";
import { TaskOwned } from "@/@types/types";
const Card = ({ task }: { task: TaskOwned }) => {
  const dueDate = new Date(task.dueDate);
  const completedOn = task.completedOn ? new Date(task.completedOn) : null;

  return (
    <Link href={`/organization/owned/tasks/${task.id}`}>
      <div className="bg-white cursor-pointer w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
        <div></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2 flex flex-row items-center flex-wrap gap-[10px]">
          {convertToTitleCase(task.title)}
          <Badge task={task} />
        </h2>
        {/* <p className="text-gray-600 mb-2">{task.note}</p> */}
        <p className="text-sm text-gray-500 mb-4">{task.description}</p>

        <div className="mt-auto text-sm space-y-1">
          {completedOn ? (
            <p>
              <span className="font-semibold text-gray-700">Completed on:</span>
              {completedOn.toDateString()} at {completedOn.toLocaleTimeString()}
            </p>
          ) : (
            <></>
          )}
          <p>
            <span className="font-semibold text-gray-700">Due:</span>
            {dueDate.toDateString()} at {dueDate.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
