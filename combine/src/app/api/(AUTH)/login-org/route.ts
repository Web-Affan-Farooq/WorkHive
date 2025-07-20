import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

export const POST = async (req: NextRequest) => {
    const { email, password } = await req.json();
    const clientCookies = await cookies();
    const requiredAccount = await prisma.organization.findUnique(
        {
            where: {
                email:email
            }
        }
    );
    let passwordMatched = false;

    if (requiredAccount) {
        passwordMatched = await bcrypt.compare(password, requiredAccount.password)

        if (passwordMatched) {
            const token = jwt.sign(
                {
                    email: requiredAccount.email,
                    id: requiredAccount.id
                },
                process.env.JWT_SECRET_KEY!,
                {
                    algorithm: "HS256"
                }
            );

             clientCookies.set("organization-manager-token", token, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 30,
                sameSite: "lax"
            });
            
            return NextResponse.json(
                {
                    message:"Organization login successfull",
                    redirect:`/organization`,
                    id:requiredAccount.id
                }
            )
        }
    }

    else return NextResponse.json({
        message: "Organization not found",
    })
}