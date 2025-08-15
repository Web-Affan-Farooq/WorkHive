"use client";
import React from "react";
import { DashboardSidebar } from "@/components/layout";
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

/*
        <main className="flex h-screen">
            <DashboardSidebar />
            <section className="flex-1 bg-white min-h-screen p-10 max-sm:px-5 max-sm:py-7">
                <div className='flex flex-row flex-nowrap justify-between items-center'>
                    <h1 className="text-[23px] font-bold text-gray-800">Your organizations</h1>
                </div>
                
                <br />
                <h2 className='font-bold px-2'>Owned by you</h2>
                <div className='flex flex-col flex-nowrap gap-[10px]'>
                    {organizations.length <= 0 ? <p className='text-gray-500 py-20 text-[18px] font-bold text-center'>No organizations found ...</p> : organizations.map((org, idx) => (
                        <div key={idx} onClick={() => selectOrganization(org.id)}>
                            <ContextMenu >
                                <ContextMenuTrigger>
                                    <Link href={"/organization"}>
                                        <div className='flex flex-row flex-nowrap justify-start items-center gap-[10px] p-5 max-sm:p-2 cursor-pointer'>
                                            <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
                                                <Image src={"/images/building.png"} alt='image' width={100} height={100} className='object-cover border-3 border-gray-600' />
                                            </div>
                                            <div>
                                                <h2 className='text-indigo-700 font-bold text-[16px]'>{org.name}</h2>
                                                <span className='text-sm text-gray-500'>{org.departments.length} departments, {countEmployees(org.id)} employees</span>
                                            </div>
                                        </div>
                                    </Link>
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem>Edit</ContextMenuItem>
                                    <ContextMenuItem className='text-red-500' onClick={() => handleOrganizationDelete(org.id)}>Delete</ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </div>
                    ))}
                </div>
                <br />
                <h2 className='font-bold px-2'>Joined by you</h2>
            </section>
        </main>
*/
