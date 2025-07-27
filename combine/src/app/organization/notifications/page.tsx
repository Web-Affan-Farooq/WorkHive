"use client";
import { ManagementSidebar } from '@/components/layout';
import { useOrganizationDashboard } from '@/stores/organization';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const timeAgo = (dateStr: string): string => {
    const now = new Date();
    const then = new Date(dateStr);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count > 0) return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }

    return "Just now";
};

const NotificationCard = ({
    notificationTitle,
    notificationText,
    date,
}: {
    notificationText: string;
    notificationTitle: string;
    date: string;
}) => {
    return (
        <div className="bg-white p-4 rounded-2xl w-full max-w-2xl">
            <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg text-gray-800">{notificationTitle}</h2>
                <span className="text-sm text-gray-400 whitespace-nowrap">
                    {timeAgo(date)}
                </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm">{notificationText}</p>
        </div>
    );
};

const Notifications = () => {
    const {notifications} = useOrganizationDashboard();

    const allSeened = notifications.every((notification) => notification.read);

    // useEffect(() => {
    //     const seenNotifications = async () => {
    //         try {
    //             const response = await axios.get()
    //         } catch (err) {
                
    //         }
    //     }
    //     if(!allSeened){

    //     }
    // },[]);
    return (
        <main className="flex min-h-screen bg-gray-100">
            <ManagementSidebar />
            <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <h1 className="text-[24px] font-bold text-gray-800">Notifications</h1>
                <div className="mt-4 flex flex-col gap-4 max-h-[80vh] pr-2">
                    {notifications.length <=0 ? <p className='text-sm text-gray-400'>No notifications found ...</p> : notifications.map((notification, idx) => (
                        <NotificationCard
                            key={idx}
                            notificationText={notification.message}
                            notificationTitle={notification.title}
                            date={notification.createdAt.toString()}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Notifications;