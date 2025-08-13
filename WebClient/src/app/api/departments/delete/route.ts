import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json();
    try {
        const newDepartment = await prisma.department.delete(
            {
                where: {
                    id: id
                },
            }
        );
        return NextResponse.json(
            {
                message: "Department deleted successfully",
                department:newDepartment
            }, {
            status: 200
        }
        )
    } catch (err) {
        console.log("Error : ", err);
        return NextResponse.json(
            {
                message: "An error occured",
            },
            {
                status: 500
            }
        )
    }
}