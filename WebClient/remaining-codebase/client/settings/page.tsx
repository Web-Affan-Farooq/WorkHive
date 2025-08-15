"use client"

import React from "react"
import { OrganizationSidebar } from "@/components/layout"
import DeleteOrganization from "./DeleteOrg"
import { useDashboard } from "@/stores/dashboard"
import { Organization } from "@/@types/Organization"

const OrganizationSettings = () => {
    const { selectedOrganization } = useDashboard()
    const organization = selectedOrganization as Organization

    return (
        <main className="relative flex h-screen bg-white">
            <OrganizationSidebar />
            <section className="flex-1 h-full overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Organization Settings
                    </h1>
                </header>

                <section className="mb-10">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Account Information
                    </h2>
                    <div className="space-y-2 text-gray-700">
                        <div>
                            <span className="font-medium">Organization Name:</span> {organization.name}
                        </div>
                        <div>
                            <span className="font-medium">Organization Email:</span> {organization.organizationEmail}
                        </div>
                    </div>
                </section>

                <section>
                    <DeleteOrganization />
                </section>
            </section>
        </main>
    )
}

export default OrganizationSettings
