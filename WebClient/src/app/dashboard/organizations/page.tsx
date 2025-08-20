"use client";
import React from "react";
// ______ Hooks ...
import { DashboardSidebar } from "@/components/layout";

// ______ Components...
import JoinedOrganizationsList from "./JoinedOrganizationsList";
import OwnedOrganizationList from "./OwnedOrganizationsList";

const Organizations = () => {
  return (
    <main className="flex h-screen">
      <DashboardSidebar />

      <section className="flex-1 bg-white min-h-screen p-10 max-sm:px-5 max-sm:py-7">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-[23px] font-bold text-gray-800">
            Your Organizations
          </h1>
        </div>

        {/* Owned by you */}
        <div className="mt-8">
          <h2 className="font-bold px-2 text-lg mb-3">Owned by you</h2>
          <OwnedOrganizationList />
        </div>

        {/* Joined by you */}
        <div className="mt-10">
          <h2 className="font-bold px-2 text-lg">Joined by you</h2>
          <JoinedOrganizationsList />
        </div>
      </section>
    </main>
  );
};

export default Organizations;
