"use client"
import { useEmployeeDashboard } from "@/stores/dashboard";
import { DashboardSidebar } from "@/components/layout";
import axios from "axios";
import toast from "react-hot-toast";

const SettingsPage= () => {
        
    return (
        <main className="flex min-h-screen bg-gray-100">
            <DashboardSidebar />
            <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <h1 className="text-[24px] font-bold text-gray-800">Settings</h1>
                
            </section>
        </main>
    );
};

export default SettingsPage;