import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const requiredEmployee = await prisma.workers.findUnique(
        {
            where: {
                id: id,
            }
        }
    );

    if (requiredEmployee) {
        return NextResponse.json(
            {
                employee: requiredEmployee
            }
        )
    }
}
