"use server"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import db from "@/db";
import { user } from "@/db/schemas";
import { eq } from "drizzle-orm";

type LoginResponse = {
  message: string;
  success:boolean;
  redirect?: "/dashboard";
};

const LoginAction = async (email:string, password:string):Promise<LoginResponse> => {
  // Get body and initialize cookies ...
  const clientCookies = await cookies();

  /* verify user ... */
  const [requiredUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email));

  if (!requiredUser) {
    return {
        message: "User not found",
        success:false
      }
  }

  const passwordMatched = await bcrypt.compare(password, requiredUser.password);

  if (!passwordMatched) {
    return {
      message: "Invalid password",
      success:false
    }
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

  return {
    message: "Login successfull",
    success:true,
    redirect: "/dashboard",
  }
};
export default LoginAction;
