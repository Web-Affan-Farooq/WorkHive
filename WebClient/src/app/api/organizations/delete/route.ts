import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json();
    try {
        await prisma.organization.delete(
            {
                where: {
                    id: id
                }
            }
        )
        return NextResponse.json(
            {
                message: "organization deleted successfully",
            },
            {
                status: 200
            }
        )
    } catch (err) {
        console.log("Error : ", err);
        return NextResponse.json(
            {
                message: "Error occured while deleting account",
            },
            {
                status: 500
            }
        )
    }

}