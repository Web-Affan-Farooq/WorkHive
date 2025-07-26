"use client"
import React, { useEffect } from 'react'
import { useOrganizationDashboard } from '@/stores/organization'
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FetchOrganizationData = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { feedUsers, feedTasks, feedDepartments } = useOrganizationDashboard();

    /* 2. _____ Fetch all data on first render to reduce server request rate ...  */
    useEffect(() => {
        const organizationId = window.localStorage.getItem("org-ID");

        const getData = async () => {
            const employeesFetched = await axios.get("/api/employees");
            const tasksFetched = await axios.get(`/api/tasks?orgId=${organizationId}`);
            const departmentsFetched = await axios.get("/api/departments");
            feedUsers(employeesFetched.data.employees);
            feedTasks(tasksFetched.data.tasks);
            feedDepartments(departmentsFetched.data.departments);
            console.log("organization.tsx :::: Line 15   departments : ", departmentsFetched.data.departments);
            console.log("organization.tsx :::: Line 15   Employees : ", employeesFetched.data.employees);
            console.log("organization.tsx :::: Line 15   Tasks : ", tasksFetched.data.tasks);
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
