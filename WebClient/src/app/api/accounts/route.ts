import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Logger from "@/lib/logger";
import { Token } from "@/@types/AuthToken";

const logger = new Logger('/api/accounts');

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.nextUrl);

    // Dynamically build select object based on query params
    const select: Record<string, boolean> = {};
    const validFields = ['name', 'organizations', 'plan',"email"];

    validFields.forEach((field) => {
        const value = searchParams.get(field);
        if (value === 'true') {
            select[field] = true;
        }
    });

    // Return 400 if no valid fields requested
    if (Object.keys(select).length === 0) {
        return NextResponse.json(
            { message: "No valid fields selected. Add ?name=true etc." },
            { status: 400 }
        );
    }

    const clientCookies = await cookies();
    const token = clientCookies.get("oms-auth-token")?.value;
    if (!token) {
        return NextResponse.redirect("/login");
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
        logger.log(25, "Get payload", payload);

        const accountId = (payload as Token).accountId;

        const requiredAccount = await prisma.accounts.findUnique({
            where: {
                id: accountId,
            },
            select,
        });

        if (!requiredAccount) {
            return NextResponse.json(
                { message: "Account not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(requiredAccount);
    } catch (error) {
        logger.log(25, "JWT verification failed", error);
        return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
};
