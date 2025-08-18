interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SUCCESS" | "FAILURE";
  read: boolean;
  createdAt: string;
  userId: string;
}

export type { Notification };
