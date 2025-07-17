import {ManagementSidebar} from "../../layout";

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
        <div className="bg-white shadow-md p-4 rounded-xl border border-gray-200 w-full max-w-2xl">
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

// import DashboardSidebar from "../components/Dashboard/Sidebar";

// const notifications = [
//     {
//         notificationText: "dfjdf kdjlfkjdslkjfkldjslkfjlskdjfds",
//         notificationTitle: "dlfkdlkfl;dfgoifdopgiopfdigopifdopgiopfdigopfdipogifodpigopfigopdifpogidfpoigpofipogifopgiopfdigopfdigopidfopgfipgoiokfldksfl;kdsl;fkd",
//         date: "2025-07-17T16:03:47.262Z",
//     },
//     {
//         notificationText: "dfjdf kdjlfkjdslkjfkldjslkfjlskdjfds",
//         notificationTitle: "dlfkdlkfl;dkfldksfl;kdsl;fkd",
//         date: "2025-07-17T16:03:47.262Z",
//     },
//     {
//         notificationText: "dfjdf kdjlfkjdslkjfkldjslkfjlskdjfds",
//         notificationTitle: "dlfkdlkfl;dkfldksfl;kdsl;fkd",
//         date: "2025-07-17T16:03:47.262Z",
//     },
//     {
//         notificationText: "dfjdf kdjlfkjdslkjfkldjslkfjlskdjfds",
//         notificationTitle: "dlfkdlkfl;dkfldksfl;kdsl;fkd",
//         date: "2025-07-17T16:03:47.262Z",
//     },
//     {
//         notificationText: "dfjdf kdjlfkjdslkjfkldjslkfjlskdjfds",
//         notificationTitle: "dlfkdlkfl;dkfldksfl;kdsl;fkd",
//         date: "2025-07-17T16:03:47.262Z",
//     },
// ]
// const NotificationCard = ({ notificationTitle, notificationText, date }: { notificationText: string; notificationTitle: string; date: string; }) => {
//     const currentDate = new Date();
//     return (
//         <div
//             className="bg-white shadow-md p-2 rounded-xl flex items-start gap-4 border border-gray-200 w-full max-w-md">
//             <div className="text-sm text-black w-full">
//                 <div className='flex flex-row justify-between items-center'>
//                     <h1 className="font-semibold text-base">{notificationTitle}</h1>
//                     <span className='text-gray-400'>{currentDate.toLocaleDateString()}</span>
//                 </div>
//                 <p className="mt-1 text-gray-700">{notificationText}</p>
//             </div>
//         </div>
//     )
// }

// const Notifications = () => {
//     return (
//         <main className="flex min-h-screen">
//             <DashboardSidebar />
//             <section className="flex-1 bg-gray-300 min-h-screen">
//                 <h1 className="text-[23px] font-bold mb-6 text-gray-800 px-8 mt-9">Notifications</h1>
//                 <div className="flex flex-col gap-4 px-8 max-sm:px-3">
//                     {notifications.map((notification, idx) => (
//                         <NotificationCard notificationText={notification.notificationText} notificationTitle={notification.notificationTitle} date={notification.date} key={idx} />
//                     ))}
//                 </div>
//             </section>
//         </main>
//     )
// }
// export default Notifications;