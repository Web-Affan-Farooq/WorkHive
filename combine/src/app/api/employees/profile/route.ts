import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {prisma} from '@/lib/prisma';

export const POST = async (req:NextRequest) => {
    const {id} = await req.json();
    const user = await prisma.users.findUnique(
        {
            where: {
                id:id
            },
            select: {
                name:true,
                email:true,
            }
        }
    );
    if(user) {
        return NextResponse.json(
            {
                user:user,
            }
        )
    }
}