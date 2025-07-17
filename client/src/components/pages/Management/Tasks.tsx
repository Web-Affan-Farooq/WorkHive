import { ManagementSidebar } from "../../layout";
import AddSharpIcon from '@mui/icons-material/AddSharp';
const tasks = [
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo:"Affan"
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo:"Affan"
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo:"Affan"
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
    assignedTo:"Affan"
  },

];

const Tasks = () => {

  return (
    <main className="flex h-screen bg-white">
      <ManagementSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
       <div className="flex flex-row flex-nowrap justify-between items-center mb-6">
         <h1 className="text-2xl font-bold text-gray-800">Tasks Assigned</h1>
         <button type="button" className="bg-gray-900 cursor-pointer px-[10px] text-sm py-[5px] rounded-md text-white flex flex-row flex-nowrap justify-start items-center gap-[3px]">
          <AddSharpIcon className="size-sm"/>
         <span>Create</span>
         </button>
       </div>

        <div className="flex flex-row flex-wrap gap-6">
          {tasks.map((task, idx) => {
            const date = new Date(task.dueDate);
            return (
              <div
                key={idx}
                className="bg-white cursor-pointer w-md max-sm:w-full relative shadow-lg p-6 rounded-xl flex flex-col border-l-4 border-blue-500 hover:border-indigo-600 transition-all duration-300">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {task.title}
                </h2>
                <span
                  className={`absolute top-7 right-7 px-2 py-1 rounded-full text-white text-xs font-semibold ${task.status === "Pending"
                      ? "bg-yellow-500"
                      : task.status === "Working"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                >
                  {task.status}
                </span>
                <p className="text-gray-600 mb-2">{task.note}</p>
                <p className="text-sm text-gray-500 mb-4">{task.description}</p>

                <div className="mt-auto text-sm space-y-1">
                  <p>
                    <span className="font-semibold text-gray-700">Assigned to:</span>{" "}
                    {task.assignedTo}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Due:</span>{" "}
                    {date.toDateString()} at {date.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Tasks;