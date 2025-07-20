import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const GET = async () => {
    const tasks = await prisma.task.findMany();
    return NextResponse.json(
        {
            tasks:tasks,
        }
    )    
}