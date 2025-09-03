import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { users } from "@/schemas";
import { eq } from "drizzle-orm";

// ____ Must export the type of response from server to client

// export type ChangePasswordAPIResponse = {
//   message: string;
// };

export type ChangePasswordAPIRequest = {
  newPassword: string;
};

const ChangePassword = async (req: NextRequest) => {
  try {
    const { newPassword }: ChangePasswordAPIRequest = await req.json();

    if (!newPassword) {
      return NextResponse.json(
        { message: "new Password is required" },
        { status: 400 }
      );
    }
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

    //  _____ password must be hashed before updating ...
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, accountId));
    return NextResponse.json(
      {
        message: "Password changed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
};
export default ChangePassword;
