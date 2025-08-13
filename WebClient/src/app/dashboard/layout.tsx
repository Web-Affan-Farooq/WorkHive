import React from 'react';
import type { Metadata } from 'next';
import { FetchDashboardData } from '@/components/layout';

export const metadata: Metadata = {
    title: "Employee dashboard",
    description: "Dashboard of employee management system"
}
const Dashboardlayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <FetchDashboardData>
                {children}
            </FetchDashboardData>
        </>
    )
}

export default Dashboardlayout
