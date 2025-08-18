import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

interface Body {
  email: string;
  password: string;
}

export const POST = async (req: NextRequest) => {
  const clientCookies = await cookies();
  const { email, password }: Body = await req.json();

  /* verify user ... */
  const requiredUser = await prisma.accounts.findUnique({
    where: {
      email: email,
    },
  });
  if (!requiredUser) {
    return NextResponse.json(
      {
        message: "User not found",
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  const passwordMatched = bcrypt.compare(password, requiredUser.password);

  if (!passwordMatched) {
    return NextResponse.json({
      message: "Invalid password",
      success: false,
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
    accountId: requiredUser.id,
    success: true,
  });
};
