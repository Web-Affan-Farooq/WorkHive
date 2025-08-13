import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (req: NextRequest) => {
    const { id }: { id: string } = await req.json();
    const requiredOrg = await prisma.organization.findUnique({
        where: {
            id: id,
        }
    });

    if (requiredOrg) {
        const requiredDepartments = await prisma.department.findMany(
            {
                where: {
                    organizationId: requiredOrg?.id
                }
            }
        )

        return NextResponse.json(
            {
                success: true,
                message: "Organization found",
                departments: requiredDepartments,
            }
        )
    }
    else {
        return NextResponse.json(
            {
                success: false,
                message: "Organization not found"
            }
        )
    }
}