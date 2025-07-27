import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Body {
    id: string;
    note: string;
    completedOn: Date;
    userId: string;
    userName: string;
    status: "LATE" | "On-TIME"
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
        if (body.status === "LATE") {
             await prisma.notification.create(
                {
                    data: {
                        title: `New task completion`,
                        message: `Late taks submission from ${body.userName}`,
                        type: "SUCCESS",
                        read: false,
                        userId: body.userId,
                    }
                }
            )
        }
        else if (body.status === "On-TIME") {
            await prisma.notification.create(
                {
                    data: {
                        title: `New task completion`,
                        message: `Task assigned to ${body.userName} hasbeen completed successfully`,
                        type: "SUCCESS",
                        read: false,
                        userId: body.userId,
                    }
                }
            )
        }

        return NextResponse.json({
            message: "Marked as done",
            success: true,
            task: updatedTask,
        });

    } catch (err) {
        console.log(err);
        return NextResponse.json({
            message: "An error occured",
            success: false,
        })
    }
}