import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

export const POST = async (req: NextRequest) => {
    const { id } = await req.json();
    const payload = await GetTokenPayload();
    if (!payload) {
        return NextResponse.json(
            {
                message: "Unauthorized"
            }, {
            status: 401
        }
        )
    }
    if (!id) {
        return NextResponse.json(
            {
                message: "Id not found"
            }, {
            status: 400
        }
        )
    }

    const requiredOrganization = await prisma.organization.findUnique(
        {
            where: {
                id: id
            },
            select: {
                departments: true
            }
        }
    )
    if (requiredOrganization) {
        return NextResponse.json(
            {
                departments: requiredOrganization.departments,
                organizationId: id,
                message: "Organization found"
            }, {
            status: 200
        }
        )
    }
    else {
        return NextResponse.json(
            {
                departments: null,
                organizationId: id,
                message: "Organization not found"
            }, {
            status: 404
        }
        )
    }
}