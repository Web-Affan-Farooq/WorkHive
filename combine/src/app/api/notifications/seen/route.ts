import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Body { userId: string; unseenedNotificationIds: string[] }

export const POST = async (req: NextRequest) => {
    const body: Body = await req.json();
    console.log("Recieved body : ",body);
    
    await prisma.notification.updateMany({
        where: {
            id: {
                in: body.unseenedNotificationIds,
            },
            userId: body.userId,
        },
        data: {
            read: true, // example field to update
        },
    }).then(() => console.log("seended notifications successfully"));
    return NextResponse.json({
        message: "seened"
    })
}