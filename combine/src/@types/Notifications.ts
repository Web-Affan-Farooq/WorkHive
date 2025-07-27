import { Users } from "./Users"

type Notifications = {
    id: string;
    title: string;
    message: string;
    type: string;           // e.g., "task_assigned", "task_completed"
    read: boolean;
    createdAt: Date;
    user: Users;
    userId: string;
}

export type {
    Notifications
}