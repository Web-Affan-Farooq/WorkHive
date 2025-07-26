import React from 'react'
import type { Metadata } from 'next'
import FetchOrganizationData from '@/components/layout/FetchOrganizationData'

export const metadata: Metadata = {
    title: "Organization dashboard",
    description: "Dashboard for managing organization"
}

const OrganizationDashboardlayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <FetchOrganizationData>
                {children}
            </FetchOrganizationData>
        </>
    )
}

export default OrganizationDashboardlayout
