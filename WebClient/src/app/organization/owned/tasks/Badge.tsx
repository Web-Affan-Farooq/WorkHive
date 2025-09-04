import { TaskOwned } from "@/@types/types";

const Badge = ({ task }: { task: TaskOwned }) => {
  const now = new Date();
  const badgeStyle = "px-2 py-1 rounded-full text-white text-xs font-semibold";

  // ✅ Completed on time
  if (task.completed && task.completedOn && task.completedOn <= task.dueDate) {
    return <span className={`${badgeStyle} bg-green-500`}>Completed</span>;
  }

  // ✅ Completed but late
  if (task.completed && task.completedOn && task.completedOn > task.dueDate) {
    return <span className={`${badgeStyle} bg-red-500`}>Completed Late</span>;
  }

  // ✅ Not completed and overdue
  if (!task.completed && now > new Date(task.dueDate)) {
    return <span className={`${badgeStyle} bg-red-500`}>Overdue</span>;
  }

  // ✅ Due today (approaching)
  const dueDate = new Date(task.dueDate);
  const isDueToday =
    dueDate.getDate() === now.getDate() &&
    dueDate.getMonth() === now.getMonth() &&
    dueDate.getFullYear() === now.getFullYear();

  if (!task.completed && isDueToday) {
    return <span className={`${badgeStyle} bg-yellow-500`}>Approaching</span>;
  }

  // ✅ Default pending
  return <span className={`${badgeStyle} bg-yellow-500`}>Pending</span>;
};

export default Badge;
