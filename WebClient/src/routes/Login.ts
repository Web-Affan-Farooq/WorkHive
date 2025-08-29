import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "@/db";
import { users } from "@/schemas";
import { eq } from "drizzle-orm";

type LoginRequest = {
  email: string;
  password: string;
};
type LoginResponse = {
  message: string;
  redirect: "/dashboard" | null;
};

export type { LoginRequest, LoginResponse };
const Login = async (req: NextRequest) => {
  // Get body and initialize cookies ...
  const clientCookies = await cookies();
  const { email, password }: LoginRequest = await req.json();

  /* verify user ... */
  const [requiredUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!requiredUser) {
    return NextResponse.json(
      {
        message: "User not found",
        redirect: null,
      },
      {
        status: 404,
      }
    );
  }

  const passwordMatched = await bcrypt.compare(password, requiredUser.password);

  if (!passwordMatched) {
    return NextResponse.json({
      message: "Invalid password",
      redirect: null,
    });
  }

  const payload = {
    email: email,
    accountId: requiredUser.id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  clientCookies.set("oms-auth-token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({
    message: "Login successfull",
    redirect: "/dashboard",
  });
};
export default Login;
