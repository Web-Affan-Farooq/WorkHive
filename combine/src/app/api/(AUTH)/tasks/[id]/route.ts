import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const requiredTask = await prisma.task.findUnique(
        {
            where: {
                id: id,
            }
        }
    );

    if (requiredTask) {
        return NextResponse.json(
            {
                task:requiredTask
            }
        )
    }
}
