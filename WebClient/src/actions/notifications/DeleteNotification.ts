"use server"
import db from "@/db";
import { notification } from "@/db/schemas";
import { eq } from "drizzle-orm";

type DeleteNotificationResponse = {
  message: string;
  success:boolean
};

const DeleteNotification = async (id:string) :Promise<DeleteNotificationResponse>=> {
  try {
    await db.delete(notification).where(eq(notification.id, id));
    return {
        message: "Notification deleted",
        success:true
      }
  } catch (err) {
    console.log(err);
    return {
        message: "An error occured while deleting notification",
        success:false
      }
  }
};
export default DeleteNotification;
