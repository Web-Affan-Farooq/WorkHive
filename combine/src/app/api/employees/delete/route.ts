import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (req: NextRequest) => {
    const { id } = await req.json();
    try {
        await prisma.users.delete({
            where: {
                id: id,
            }
        });

        return NextResponse.json(
            {
                message: "User deleted successfully",
                success: true,
            }
        )
    } catch (err) {
        return NextResponse.json(
            {
                message: "An error occured",
                success: false,
            }
        )
    }
}