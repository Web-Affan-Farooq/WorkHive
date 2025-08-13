import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.nextUrl);
    const departmentId = searchParams.get("departmentId")!;
    if (departmentId) {
        const userProfiles = await prisma.accounts.findMany(
            {
                where: {
                    departments: {
                        some: {
                            id: departmentId
                        }
                    }
                },
                select: {
                    name:true,
                    email:true,
                }
            }
        );

        return NextResponse.json(
            {
                department: departmentId,
                users:userProfiles
            }
        );
    }
    else {
        return NextResponse.json(
            {
                message: "Please make sure to mention department id"
            },
            {
                status: 404
            }
        )
    }
}