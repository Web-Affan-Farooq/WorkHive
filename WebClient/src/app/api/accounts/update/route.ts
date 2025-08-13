import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import Logger from "@/lib/logger";
import { Token } from "@/@types/AuthToken";

const logger = new Logger("/api/accounts/update");

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { newEmail, newName } = body;
    const clientCookies = await cookies();
    const token = clientCookies.get("oms-auth-token")?.value;

    if (!token) {
      return NextResponse.redirect("/login");
    }

    if (!newEmail || !newName) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    logger.log(25, "Get payload", payload);

    const accountId = (payload as Token).accountId;

    await prisma.accounts.update({
      where: {
        id: accountId,
      },
      data: {
        name: newName,
        email: newEmail,
      }
    });

    return NextResponse.json(
      { message: "User information updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
