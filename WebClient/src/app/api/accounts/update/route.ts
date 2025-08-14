import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { newEmail, newName } = body;

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

    if (!newEmail || !newName) {
      return NextResponse.json({ error: "name and email are required" }, { status: 400 });
    }


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
