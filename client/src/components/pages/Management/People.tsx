import { ManagementSidebar} from "../../layout";

const tasks = [
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
  },
  {
    title: "UI Bug Fix ",
    note: "Fix header not responsive on mobile.",
    description:
      "Resolve issues in the main dashboard header when viewed on mobile screens. Ensure full responsiveness.",
    dueDate: "2025-07-20T10:00:00.000Z",
    status: "Working",
  },
  {
    title: "Database Indexing",
    note: "Optimize query performance.",
    description:
      "Add necessary indexing to tables frequently accessed during sales filtering.",
    dueDate: "2025-07-22T18:30:00.000Z",
    status: "Completed",
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
  },
  {
    title: "UI Bug Fix ",
    note: "Fix header not responsive on mobile.",
    description:
      "Resolve issues in the main dashboard header when viewed on mobile screens. Ensure full responsiveness.",
    dueDate: "2025-07-20T10:00:00.000Z",
    status: "Working",
  },
  {
    title: "Database Indexing",
    note: "Optimize query performance.",
    description:
      "Add necessary indexing to tables frequently accessed during sales filtering.",
    dueDate: "2025-07-22T18:30:00.000Z",
    status: "Completed",
  },
  {
    title: "Cache implementation",
    note: "Add caching to sales dashboard for performance.",
    description:
      "Implement caching mechanism to reduce backend load and improve response time for frequent sales queries.",
    dueDate: "2025-07-17T14:15:00.774Z",
    status: "Pending",
  },
  {
    title: "UI Bug Fix ",
    note: "Fix header not responsive on mobile.",
    description:
      "Resolve issues in the main dashboard header when viewed on mobile screens. Ensure full responsiveness.",
    dueDate: "2025-07-20T10:00:00.000Z",
    status: "Working",
  },
  {
    title: "Database Indexing",
    note: "Optimize query performance.",
    description:
      "Add necessary indexing to tables frequently accessed during sales filtering.",
    dueDate: "2025-07-22T18:30:00.000Z",
    status: "Completed",
  },
];

const Tasks = () => {
    
  return (
    <main className="flex h-screen bg-white">
      <ManagementSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">People</h1>
        people
      </section>
    </main>
  );
};

export default Tasks;