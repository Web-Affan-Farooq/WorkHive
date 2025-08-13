import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
// import { cookies } from "next/headers";
// get account id from token 
// filter organizations with this userid (account id) and get their ids , then fetch departments of that organiztation id one by one 

export const POST= async (req: NextRequest) => {
    const { orgId } = await req.json();
    try {
        const organizationDepartments = await prisma.department.findMany(
            {
                where: {
                    organizationId: orgId
                },
            }
        );
        return NextResponse.json(
            {
                departments: organizationDepartments,
            }
        )
    } catch (err) {
        console.log("Error : ", err);
        return NextResponse.json(
            {
                message: "An error occured",
            },
            {
                status: 500
            }
        )
    }
}