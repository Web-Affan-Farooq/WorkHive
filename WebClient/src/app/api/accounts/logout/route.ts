import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async () => {
  const clientCookies = await cookies();
  clientCookies.set("oms-auth-token", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    expires: 60,
  });
  return NextResponse.json({
    message: "Logout successfull",
  });
};
