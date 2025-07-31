import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

interface Body {
    managerEmail: string;
    organizationEmail: string;
    orgPassword: string;
}

const verifyExistence = async (orgEmail: string, managerEmail: string) => {
    const requiredOrganization = await prisma.organization.findUnique(
        {
            where: {
                email: orgEmail,
            }
        }
    );
    const requiredManager = await prisma.users.findUnique({
        where: {
            email: managerEmail,
            isManager: true,
        }
    });

    if (requiredManager && requiredOrganization) {
        return {
            manager: requiredManager,
            organization: requiredOrganization
        }
    }

    else {
        return {
            manager: null,
            organization: null
        }
    }

}

export const POST = async (req: NextRequest) => {

    /* ___ Getting body and cookies ... */
    const { managerEmail, organizationEmail, orgPassword }: Body = await req.json();
    const clientCookies = await cookies();

    const { manager, organization } = await verifyExistence(organizationEmail, managerEmail);

    if (!manager) {
        console.log("Manager not found   :::: Line 55 /api/organization/login");

        return NextResponse.json({
            message: "User not found",
            success: false,
        }, { status: 404 });
    }
    if (!organization) {
        console.log("organization not found   :::: Line 63 /api/organization/login");

        return NextResponse.json({
            message: "Organization not found",
        }, { status: 404 })
    }

    /* if organization and  it's manager exists ... */
    const passwordMatched = await bcrypt.compare(orgPassword, organization.password)
    console.log("Password matched   :::: Line 72 /api/organization/login");

    /* Proceed furthur if password matched ... */
    if (passwordMatched) {
        console.log("Password matched   :::: Line 76 /api/organization/login", passwordMatched, orgPassword);
        /* create jwt token ... */
        const token = jwt.sign(
            {
                email: manager.email,
                organizationEmail: organization.email,
            },
            process.env.JWT_SECRET_KEY!
        );
        console.log("Token created successfully  :::: Line 85 /api/organization/login", token);

        clientCookies.set("organization-manager-token", token, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            sameSite: "lax"
        });

        return NextResponse.json(
            {
                message: "Organization login successfull",
                redirect: `/organization`,
                success: true,
                organizationId: organization.id,
                userId: manager.id,
            }
        )
    } else {
        console.log("Invalid password   :::: Line 72 /api/organization/login");
        return NextResponse.json(
            {
                message: "Invalid password",
                success: false,
            }, { status: 403 }
        )
    }
}