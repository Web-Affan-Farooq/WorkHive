import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

export const DELETE = async () => {
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
    const accountId = payload.accountId;

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