import { useJoinedOrganization } from "@/stores/joinedOrg";
import { useMemo } from "react";

const useJoinedOrganizationData = () => {
  const { tasks } = useJoinedOrganization();
  const now = new Date();

  // ___ Helper for month name
  const getMonthName = (monthIndex: number) => {
    return new Date(2000, monthIndex, 1).toLocaleString("default", {
      month: "long",
    });
  };

  // ___ Tasks assigned this month
  const tasksAssignedThisMonth = useMemo(() => {
    return tasks.filter((tsk) => {
      const assignmentDate = new Date(tsk.assignedOn);
      return (
        assignmentDate.getMonth() === now.getMonth() &&
        assignmentDate.getFullYear() === now.getFullYear()
      );
    });
  }, [tasks, now]);

  // ___ Tasks completed this month
  const tasksCompletedThisMonth = useMemo(() => {
    return tasksAssignedThisMonth.filter((tsk) => tsk.completed);
  }, [tasksAssignedThisMonth]);

  // ___ Overdue tasks this month
  const taskOverdue = useMemo(() => {
    return tasksAssignedThisMonth.filter((tsk) => {
      const dueDate = new Date(tsk.dueDate);
      return !tsk.completed && now > dueDate;
    });
  }, [tasksAssignedThisMonth, now]);

  // ___ Last six months data
  const lastSixMonthsData = useMemo(() => {
    const data: {
      month: string;
      assigned: number;
      completed: number;
      overdue: number;
    }[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "short" });

      const taskAssigned = tasks.filter((task) => {
        const assignedDate = new Date(task.assignedOn);
        return (
          assignedDate.getMonth() === date.getMonth() &&
          assignedDate.getFullYear() === date.getFullYear()
        );
      });

      const taskCompleted = taskAssigned.filter((task) => task.completed);

      const tasksOverdue = taskAssigned.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return !task.completed && now > dueDate;
      });

      data.push({
        month,
        assigned: taskAssigned.length,
        completed: taskCompleted.length,
        overdue: tasksOverdue.length,
      });
    }

    return data;
  }, [tasks, now]);

  // ___ Get readable month names
  const currentMonth = getMonthName(now.getMonth());
  const startingMonth = getMonthName(
    new Date(now.getFullYear(), now.getMonth() - 5, 1).getMonth()
  );

  return {
    tasksAssignedThisMonth,
    tasksCompletedThisMonth,
    taskOverdue,
    lastSixMonthsData,
    currentMonth, // "August"
    startingMonth, // "February"
  };
};

export default useJoinedOrganizationData;
