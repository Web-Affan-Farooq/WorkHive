// import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { users } from "@/schemas";
import { eq } from "drizzle-orm";

type UpdateProfileRequest = {
  newName: string;
  newEmail: string;
};

type UpdateProfileResponse = {
  message: string;
};
export type { UpdateProfileRequest, UpdateProfileResponse };

const UpdateProfile = async (req: NextRequest) => {
  try {
    const body: UpdateProfileRequest = await req.json();
    const payload = await GetTokenPayload();

    if (!payload) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const accountId = payload.accountId;

    if (!body.newEmail || !body.newName) {
      return NextResponse.json(
        { error: "name and email are required" },
        { status: 400 }
      );
    }
    await db
      .update(users)
      .set({ name: body.newName, email: body.newEmail })
      .where(eq(users.id, accountId));

    return NextResponse.json(
      { message: "User information updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
export default UpdateProfile;
