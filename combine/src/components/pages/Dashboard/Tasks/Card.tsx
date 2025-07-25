import { Task } from "@/@types/Task";

const Card = ({task}:{task:Task}) => {
    const times = {
      dueDate:new Date(task.dueDate),

    }
  return (
    <div
      className="cursor-pointer bg-white w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {task.title}
      </h2>
      <span
        className={`absolute top-7 right-7 px-2 py-1 rounded-full text-white text-xs font-semibold ${task.completed
          ? "bg-green-500" : "bg-yellow-500"  }`}
      >
        {task.completed? "Completed" : "Pending"}
      </span>
      {/* <p className="text-gray-600 mb-2">{task.note}</p> */}
      <p className="text-sm text-gray-500 mb-4">{task.description}</p>

      <div className="mt-auto text-sm space-y-1">
        <p>
          <span className="font-semibold text-gray-700">Due:</span>{" "}
          {times.dueDate.toDateString()} at {times.dueDate.toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
export default Card;