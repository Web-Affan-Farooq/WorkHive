import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Body {
    id: string;
    note: string;
    completedOn: Date;
}

export const POST = async (req: NextRequest) => {
    const body: Body = await req.json();
    try {
        const updatedTask = await prisma.task.update(
            {
                where: {
                    id: body.id,
                },
                data: {
                    note: body.note,
                    completed: true,
                    completedOn: body.completedOn,
                }
            }
        );

        return NextResponse.json({
            message: "Marked as done",
            success: true,
            task:updatedTask,
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "An error occured",
            success: false,
        })
    }
}