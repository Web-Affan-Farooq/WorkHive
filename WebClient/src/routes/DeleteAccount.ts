import { NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";
import { users } from "@/schemas";
import db from "@/db";
import { eq } from "drizzle-orm";

type DeleteAccountResponse = {
  message: string;
};
export type { DeleteAccountResponse };

const DeleteAccount = async () => {
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

  try {
    await db.delete(users).where(eq(users.id, accountId));
    return NextResponse.json(
      {
        message: "Account deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured",
      },
      { status: 500 }
    );
  }
};
export default DeleteAccount;
