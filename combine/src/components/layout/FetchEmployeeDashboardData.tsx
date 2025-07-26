"use client";
import { useEmployeeDashboard } from '@/stores/dashboard';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const FetchData = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { feedTasks } = useEmployeeDashboard();
    useEffect(() => {
        console.log("Fetching data ...");
        const userId = window.localStorage.getItem("user-ID");
        const getTasks = async () => {
            const response = await axios.get(`/api/tasks?userId=${userId}`);
            feedTasks(response.data.tasks)
        }
        if (userId) {
            getTasks()
            const interval = setInterval(() => {
                getTasks();
            },120000); // 60 seconds

            return () => clearInterval(interval); // ✅ cleanup
        }
        else {
            router.push("/login-employee")
        }
    }, [feedTasks, router]);

    return (
        <>
            {children}
        </>
    )
}

export default FetchData
