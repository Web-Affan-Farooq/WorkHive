import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const GET = async () => {
    const employees = await prisma.users.findMany();
    return NextResponse.json(
        {
            employees:employees
        }
    )    
}