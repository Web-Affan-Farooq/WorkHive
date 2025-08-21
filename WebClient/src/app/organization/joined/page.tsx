"use client";
import { JoinedOrganizationSidebar } from "@/components/layout";
import useJoinedOrganizationData from "./useJoinedOrganizationData";
import JoinedOrganizationAnalytics from "./Analytics";
import CalenderView from "./CalenderView";

const OrganizationPage = () => {
  const { tasksAssignedThisMonth, tasksCompletedThisMonth, taskOverdue } =
    useJoinedOrganizationData();
  return (
    <main className="flex h-screen">
      <JoinedOrganizationSidebar />
      <section className="flex-1 bg-white h-screen overflow-y-auto">
        {/* main heading */}
        <h1 className="text-[23px] font-bold text-gray-800 pt-10 pb-5 px-7 max-sm:px-5 max-sm:py-7 bg-indigo-500">
          Progress
        </h1>
        {/*  Flash cards  */}
        <div className="flex flex-row flex-nowrap gap-[10px]">
          <div className="flex flex-row flex-wrap gap-5 px-7 pb-5">
            <div className="bg-green-500 rounded-2xl w-[160px] h-[80px] px-4 py-2 max-sm:w-[130px] max-sm:h-[65px]">
              <span className="text-sm text-gray-200">Tasks assigned</span>
              <p className="text-3xl font-bold text-white max-sm:text-xl">
                {tasksAssignedThisMonth.length}
              </p>
            </div>
            <div className="bg-pink-600 rounded-2xl w-[160px] h-[80px] px-4 py-2 max-sm:w-[130px] max-sm:h-[65px]">
              <span className="text-sm text-gray-200">Completed</span>
              <p className="text-3xl font-bold text-white max-sm:text-xl">
                {tasksCompletedThisMonth.length}
              </p>
            </div>
          </div>
        </div>
        <br />
        <div>
          {taskOverdue.length <= 0 ? (
            <></>
          ) : (
            <p>{taskOverdue.length} tasks overdue</p>
          )}
        </div>
        <br />
        <br />
        <div className="max-sm:p-0 px-7">
          <JoinedOrganizationAnalytics />
        </div>
        <div className="max-sm:p-0 px-7">
          <CalenderView />
        </div>
      </section>
    </main>
  );
};

export default OrganizationPage;
