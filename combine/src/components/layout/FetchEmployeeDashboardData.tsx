"use client";
import { useEmployeeDashboard } from '@/stores/dashboard';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react'

const FetchData = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const { feedTasks, feedNotifications, feedUser } = useEmployeeDashboard();
    useEffect(() => {
        console.log("Fetching data ...");
        const userId = window.localStorage.getItem("user-ID");
        const getTasks = async () => {
            const response = await axios.get(`/api/tasks?userId=${userId}`);
            const fetchedNotifications = await axios.get(`/api/notifications?userId=${userId}`);
            const fetchedProfile = await axios.post("/api/employees/profile", {
                id: userId,
            });

            feedUser(fetchedProfile.data.user)
            feedTasks(response.data.tasks);
            feedNotifications(fetchedNotifications.data.notifications);
        }
        if (userId) {
            getTasks()
            const interval = setInterval(() => {
                getTasks();
            }, 120000); // 60 seconds

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
