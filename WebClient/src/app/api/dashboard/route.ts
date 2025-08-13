// import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Token } from "@/@types/AuthToken";
import { Profile } from "@/@types/modeltypes";
import { Department } from "@/generated/prisma";

export const GET = async () => {
    const clientCookies = await cookies();
    const token = clientCookies.get("oms-auth-token")?.value;

    if (!token) {
        return NextResponse.json(
            {
                message:"Unauthorized"
            },{
                status:401
            }
        )
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    const accountId = (payload as Token).accountId;

    const requiredAccount = await prisma.accounts.findUnique(
        {
            where: {
                id: accountId
            },
            select: {
                name: true,
                email: true,
                plan: true,
                organizations: true,
            }
        }
    );

    if (!requiredAccount) {
        return NextResponse.json(
            {
                message: "Account not found"
            }, {
            status: 404
        }
        )
    }

    const organizations = await Promise.all(
        requiredAccount.organizations.map(async (org) => {
            const departments = await prisma.department.findMany({
                where: {
                    organizationId: org.id
                },
                select: {
                    name: true,
                    id: true,
                    organizationId: true,
                    users: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                }
            });
            const data: {
                id: string;
                name: string;
                email: string;
                departments: Department[];
                users: Record<string, Profile[]>,
            } = {
                id: org.id,
                name: org.name,
                email: org.organizationEmail,
                departments: departments.map((dept) => ({ id: dept.id, name: dept.name, organizationId: dept.organizationId })),
                users: {}
            };
            departments.forEach((dept) => {
                data.users[dept.id] = dept.users
            });

            return data;
        })
    );

    const data = {
        name: requiredAccount.name,
        email: requiredAccount.email,
        plan: requiredAccount.plan,
        organizations: organizations,
    }

    return NextResponse.json(
        {
            data: data,
        },
        { status: 200 }
    )
}


// get account id from cookie
// after that fetch all the organizations where userId===account id you got

// then fetch each departments of each organization one by one where organizationId === loop through and get the id of organizations


