import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import Logger from "@/lib/logger";
import GetTokenPayload from "@/utils/GetTokenPayload";

const logger = new Logger("/api/accounts/change-password");

export async function PUT(req: NextRequest) {
  try {
    const { newPassword } = await req.json();
    logger.log(15, "Get password : ", newPassword)

    if (!newPassword) {
      return NextResponse.json({ message: "new Password is required" }, { status: 400 });
    }
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);


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
