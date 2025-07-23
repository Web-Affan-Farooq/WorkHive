"use client";
import { ManagementSidebar } from '@/components/layout';
import { useOrganizationDashboard } from '@/stores/organization';

const Departments = () => {
    const {departments} = useOrganizationDashboard();

    return (
        <main className="flex min-h-screen bg-gray-100">
            <ManagementSidebar />
            <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <h1 className="text-[24px] font-bold text-gray-800">Departments</h1>
                <div className="mt-4 flex flex-col gap-4 max-h-[80vh] pr-2">
                    {departments.map((department,idx) => (
                        <div key={idx} className='px-5 py-3'>
                            <h2 className='text-base font-semibold'>{department.name}</h2> 
                            <span>3 users</span>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Departments;