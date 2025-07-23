import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export const GET = async ({params}:{params:Promise<{id:string}>}) => {
    const {id} = await params;
    const requiredDepartment = await prisma.department.findUnique({
        where: {
            id:id,
        }
    });
    if(requiredDepartment) {
        return NextResponse.json(
            {
                department:requiredDepartment,
            }
        )
    }
    else {
    return NextResponse.json(
            {
                department:requiredDepartment,
            }
        )
    }
}