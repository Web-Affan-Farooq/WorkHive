"use client";
import { ManagementSidebar } from '@/components/layout';
import { useOrganizationDashboard } from '@/stores/organization';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"

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

interface NotificationCardProps {
    notificationTitle: string;
    notificationText: string;
    date: string;
    read: boolean;
}
const NotificationCard = ({
    notificationTitle,
    notificationText,
    date,
    read,
}: NotificationCardProps) => {
    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow w-full max-w-2xl border border-gray-100">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    {!read && <span className="w-2 h-2 bg-green-500 rounded-full" title="Unread"></span>}
                    <h2 className="font-semibold text-lg text-gray-800">
                        {notificationTitle}
                    </h2>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                    {timeAgo(date)}
                </span>
            </div>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                {notificationText}
            </p>
        </div>
    );
};

const Notifications = () => {
    const { notifications ,deleteNotification} = useOrganizationDashboard();

    const allSeened = notifications.every((notification) => notification.read);
    const unseenedNotifications = notifications.filter((notification) => !notification.read);

    useEffect(() => {
        const userId = window.localStorage.getItem("user-ID");

        const seenNotifications = async (userId: string) => {
            const payload: { userId: string; unseenedNotificationIds: string[] } = {
                userId: userId,
                unseenedNotificationIds: unseenedNotifications.map((notification) => (notification.id))
            }
            try {
                await axios.post(`/api/notifications/seen`, payload);
            } catch (err) {
                console.log(err);
                toast.error("An error occured")
            }
        }

        if (!allSeened && userId) {
            seenNotifications(userId)
        }
    }, []);

    const handleDelete = async (id: string) => {
        const response = await axios.delete("/api/notifications/delete", {
            data: {
                id: id
            }
        });
        if (!response.data.success) {
            toast.error("An error occured");
        }
        toast.success(response.data.message);
        deleteNotification(id)
    }
    return (
        <main className="flex min-h-screen bg-gray-100">
            <ManagementSidebar />
            <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <h1 className="text-[24px] font-bold text-gray-800">Notifications</h1>
                <div className="mt-4 flex flex-col gap-4 max-h-[80vh] pr-2">
                    {notifications.length <= 0 ? <p className='text-sm text-gray-400'>No notifications found ...</p> : notifications.map((notification, idx) => (
                        <ContextMenu key={idx}>
                            <ContextMenuTrigger>
                                <NotificationCard
                                    key={idx}
                                    notificationText={notification.message}
                                    notificationTitle={notification.title}
                                    read={notification.read}
                                    date={notification.createdAt.toString()}
                                />
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => handleDelete(notification.id)}>Delete</ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Notifications;