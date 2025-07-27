import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.nextUrl);
    const userId = searchParams.get("userId");
    if (userId) {
        const notifications = await prisma.notification.findMany(
            {
                where: {
                    userId: userId
                }
            }
        );
        return NextResponse.json({
            notifications: notifications,
        })
    }
    else {
        return NextResponse.json(
            {
                message:"Please send a user id"
            }
        )
    }

}