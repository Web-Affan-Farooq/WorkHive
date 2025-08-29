import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { notifications } from "@/schemas";
import { eq } from "drizzle-orm";

type DeleteNotificationRequest = {
  id: string;
};
type DeleteNotificationResponse = {
  message: string;
};
const DeleteNotification = async (req: NextRequest) => {
  const { id } = await req.json();

  try {
    await db.delete(notifications).where(eq(notifications.id, id));
    return NextResponse.json(
      {
        message: "Notification delete",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured while deleting notification",
      },
      {
        status: 500,
      }
    );
  }
};
export default DeleteNotification;
