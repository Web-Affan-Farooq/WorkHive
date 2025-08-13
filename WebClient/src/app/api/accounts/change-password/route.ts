import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Token } from "@/@types/AuthToken";

import Logger from "@/lib/logger";


const logger = new Logger("/api/accounts/change-password");

export async function PUT(req: NextRequest) {
  try {
    const { newPassword } = await req.json();
    logger.log(15, "Get password : ", newPassword)

    const clientCookies = await cookies();
    const token = clientCookies.get("oms-auth-token")?.value;

    if (!newPassword) {
      return NextResponse.json({ message: "new Password is required" }, { status: 400 });
    }
    if (!token) {
      return NextResponse.redirect("/login")
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    logger.log(28, "Get payload", payload);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const accountId = (payload as Token).accountId;


    await prisma.accounts.update({
      where: {
        id: accountId,
      },
      data: {
        password: hashedPassword
      }
    });

    return NextResponse.json({ message: "Password updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
