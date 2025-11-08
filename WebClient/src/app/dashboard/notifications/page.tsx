"use client";
// ______ Hooks ...
import { useDashboard } from "@/stores/dashboard";
// ______ Components ...
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DashboardSidebar } from "@/components/layout";

// ______ Utils ...
import Notify from "@/utils/Notifications";
import ShowClientError from "@/utils/Error";
// ______ Server action ...
import { DeleteNotificationAction } from "@/actions/notifications";
import { toast } from "sonner";

// ______ Function for calculating timestamp when notification is created...
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
    if (count > 0)
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
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
          {!read && (
            <span
              className="w-2 h-2 bg-green-500 rounded-full"
              title="Unread"
            ></span>
          )}
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
  // ______ Getting list of notifications from global state...
  const { notifications, setNotifications } = useDashboard();
  // ______ Function for handling notification delete...
  const handleDelete = async (id: string) => {
    // ______ Create a DELETE request to /api/notifications/delete + show error / success fallback and then update the ui ...
    try {
      const { success, message } = await DeleteNotificationAction(id);
      if (!success) {
        Notify.error(message);
      }
      Notify.success(message);
      const remainingNotifications = notifications.filter(
        (not) => not.id !== id
      );
      setNotifications(remainingNotifications);
    } catch (err) {
      toast.error("An error occured");
    }
  };
  return (
    <main className="flex min-h-screen bg-gray-100">
      <DashboardSidebar />
      <section className="flex-1 h-screen overflow-y-auto p-10 max-sm:px-5 max-sm:py-7">
        <h1 className="text-[24px] font-bold text-gray-800">Notifications</h1>
        <div className="mt-4 flex flex-col gap-4 max-h-[80vh] pr-2">
          {notifications.length <= 0 ? (
            <p className="text-sm text-gray-400">No notifications found ...</p>
          ) : (
            notifications.map((notification, idx) => (
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
                  <ContextMenuItem
                    onClick={() => handleDelete(notification.id)}
                  >
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Notifications;
