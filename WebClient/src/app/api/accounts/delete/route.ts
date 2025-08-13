import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Logger from "@/lib/logger";
import { Token } from "@/@types/AuthToken";

const logger = new Logger("/api/accounts/delete");

export const DELETE = async () => {
    const clientCookies = await cookies();
    const token = clientCookies.get("oms-auth-token")?.value;
    if (!token) {
        return NextResponse.redirect("/login");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    logger.log(18, "Get payload", payload);

    const accountId = (payload as Token).accountId;

    try {
        await prisma.accounts.delete({
            where: {
                id: accountId,
            },
        });
        return NextResponse.json(
            {
                message: "User deleted successfully",
            }, {
            status: 200
        }
        )
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                message: "An error occured",
            },
            { status: 500 }
        )
    }
}