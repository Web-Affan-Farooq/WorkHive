import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.nextUrl);
    const organizationId = searchParams.get("orgId");
    const userId = searchParams.get("userId");
    console.log("Line 9 :::: organization id : ",organizationId);
    console.log("Line 10 ::::: user id : ",userId);
    

    if (organizationId) {
        const users = await prisma.users.findMany(
            {
                where: {
                    organizationId: organizationId
                },
                select: {
                    id: true,
                }
            }
        );
        const allTasks = await Promise.all(
            users.map((user) =>
                prisma.task.findMany({
                    where: { userId: user.id },
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        assignedOn: true,
                        dueDate: true,
                        userId: true,
                        completed: true,
                        completedOn: true,
                    },
                })
            )
        );
        const flatten = allTasks.flat();

        return NextResponse.json(
            { tasks: flatten }
        )
    }

    else if(userId) {        
        const tasks  = await prisma.task.findMany(
            {
                where: {
                    userId:userId,
                }
            }
        );
        return NextResponse.json(
            {
                tasks:tasks,
            }
        );
    }
}