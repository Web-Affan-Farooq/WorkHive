"use client"
import React, { useEffect } from 'react'
import { useOrganizationDashboard } from '@/stores/organization'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FetchOrganizationData = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { feedUsers, feedTasks, feedDepartments, feedNotifications } = useOrganizationDashboard();

    /* 2. _____ Fetch all data on first render to reduce server request rate ...  */
    useEffect(() => {
        const organizationId = window.localStorage.getItem("org-ID");
        const userId = window.localStorage.getItem("user-ID");

        const getData = async () => {
            const employeesFetched = await axios.get("/api/employees");
            const tasksFetched = await axios.get(`/api/tasks?orgId=${organizationId}`);
            const departmentsFetched = await axios.get("/api/departments");
            const notificationsFetched = await axios.get(`/api/notifications?userId=${userId}`)
            feedUsers(employeesFetched.data.employees);
            feedTasks(tasksFetched.data.tasks);
            feedDepartments(departmentsFetched.data.departments);
            feedNotifications(notificationsFetched.data.notifications);
            console.log("organization.tsx :::: Line 15   departments : ", departmentsFetched.data.departments);
            console.log("organization.tsx :::: Line 15   Employees : ", employeesFetched.data.employees);
            console.log("organization.tsx :::: Line 15   Tasks : ", tasksFetched.data.tasks);
            console.log("organization.tsx :::: Line 15   Notifications : ", notificationsFetched.data.notifications);
        };

        if (organizationId) {
            getData();
            const interval = setInterval(() => {
                getData();
            }, 120000);
            return () => clearInterval(interval);

        } else {
            router.push("/login-org")
        }
    }, [feedUsers, feedTasks, feedDepartments]);
    return (
        <>
            {children}
        </>
    )
}

export default FetchOrganizationData