import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const DELETE = async (req:NextRequest) => {
    const {id} = await req.json();
    await prisma.notification.delete(
        {
            where:{
                id:id
            }
        }
    );
    return NextResponse.json(
        {
            message:"Notification deleted successfully",
            success:true,
        }
    )
}