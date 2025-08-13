"use client"
import React from 'react'
import { DashboardSidebar } from "@/components/layout"
import Image from 'next/image';
import Link from 'next/link';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useDashboard } from '@/stores/dashboard';
import axios from 'axios';
import toast from 'react-hot-toast';

const Organizations = () => {
    const { organizations, feedOrganizations, selectOrganization } = useDashboard();
    const countEmployees = (id: string) => {
        const requiredOrg = organizations.find((org) => org.id === id)!;
        let count = 0;
        Object.values(requiredOrg.users).forEach((array) => { count += array.length })
        return count
    }

    const handleOrganizationDelete = async (id: string) => {
        try {
            const response = await axios.delete("/api/organizations/delete", {
                data: {
                    id: id
                }
            });
            toast.success(response.data.message);
            feedOrganizations(
                organizations.filter((org) => (org.id !== id))
            )

        } catch (err) {
            console.log("Error : ", err);
            toast.error("An error occured while deleting organization")
        }
    }

    return (
        <main className="flex h-screen">
            <DashboardSidebar />
            <section className="flex-1 bg-white min-h-screen p-10 max-sm:px-5 max-sm:py-7">
                <div className='flex flex-row flex-nowrap justify-between items-center'>
                    <h1 className="text-[23px] font-bold text-gray-800">Your organizations</h1>
                </div>
                <br />
                {/* Organizations grid */}
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
            </section>
        </main>
    )
}

export default Organizations
