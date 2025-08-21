"use client";
import FullCalender from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import useJoinedOrganizationData from "./useJoinedOrganizationData";

const CalenderView = () => {
  const { tasksAssignedThisMonth } = useJoinedOrganizationData();
  const calenderData = tasksAssignedThisMonth.map((task) => ({
    title: task.title,
    date: task.dueDate,
  }));

  return (
    <>
      <FullCalender
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={calenderData}
        height="auto"
      />
    </>
  );
};

export default CalenderView;
