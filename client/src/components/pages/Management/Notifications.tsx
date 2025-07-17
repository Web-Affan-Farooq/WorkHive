import { ManagementSidebar } from "../../layout";
import Paper from '@mui/material/Paper';

const notifications = [
    {
        notificationText: "Your assignment has been graded successfully.",
        notificationTitle: "Grading Complete",
        date: "2025-07-17T14:20:00.000Z",
    },
    {
        notificationText: "You have a new message from your mentor.",
        notificationTitle: "New Message",
        date: "2025-07-16T09:45:00.000Z",
    },
    {
        notificationText: "Your session starts in 30 minutes.",
        notificationTitle: "Session Reminder",
        date: "2025-07-17T10:30:00.000Z",
    },
    {
        notificationText: "Your assignment has been graded successfully.",
        notificationTitle: "Grading Complete",
        date: "2025-07-17T14:20:00.000Z",
    },
    {
        notificationText: "You have a new message from your mentor.",
        notificationTitle: "New Message",
        date: "2025-07-16T09:45:00.000Z",
    },
    {
        notificationText: "Your session starts in 30 minutes.",
        notificationTitle: "Session Reminder",
        date: "2025-07-17T10:30:00.000Z",
    },
    {
        notificationText: "Your assignment has been graded successfully.",
        notificationTitle: "Grading Complete",
        date: "2025-07-17T14:20:00.000Z",
    },
    {
        notificationText: "You have a new message from your mentor.",
        notificationTitle: "New Message",
        date: "2025-07-16T09:45:00.000Z",
    },
    {
        notificationText: "Your session starts in 30 minutes.",
        notificationTitle: "Session Reminder",
        date: "2025-07-17T10:30:00.000Z",
    },
];

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
        <Paper elevation={5} className="bg-white p-4 rounded-2xl w-full max-w-2xl">
                <div className="flex justify-between items-start">
                    <h2 className="font-semibold text-lg text-gray-800">{notificationTitle}</h2>
                    <span className="text-sm text-gray-400 whitespace-nowrap">
                        {timeAgo(date)}
                    </span>
                </div>
                <p className="mt-2 text-gray-600 text-sm">{notificationText}</p>
        </Paper>
    );
};

const Notifications = () => {
    return (
        <main className="flex min-h-screen bg-gray-100">
            <ManagementSidebar />
            <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
                <h1 className="text-[24px] font-bold text-gray-800">Notifications</h1>
                <div className="mt-4 flex flex-col gap-4 max-h-[80vh] pr-2">
                    {notifications.map((notification, idx) => (
                        <NotificationCard
                            key={idx}
                            notificationText={notification.notificationText}
                            notificationTitle={notification.notificationTitle}
                            date={notification.date}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Notifications;