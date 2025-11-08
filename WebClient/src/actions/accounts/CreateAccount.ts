"use server"
import { Token } from "@/@types/AuthToken";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import db from "@/db";
import { user } from "@/db/schemas/index";
import { eq } from "drizzle-orm";
import { PlanType } from "@/@types/types";

// ____ export types of route ...
type CreateAccountResponse = {
  message: string;
  success:boolean
  redirect?: string;
};

type CreateAccountRequest = {
  name: string;
  email: string;
  password: string;
  plan: PlanType;
};

const CreateAccount = async (body:CreateAccountRequest) :Promise<CreateAccountResponse>=> {
  try {
    // _____ Check if account already exists ...
    const alreadyExists = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email));

    if (alreadyExists.length > 0) {
      return {
          message: "Account already exists",
          success:false
        }
    }

    // _____ Hash password ...
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // _____ Create new user ...
    const [newUser] = await db
      .insert(user)
      .values({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        plan: body.plan,
        stripeCustomerId: null,
        stripeSubId: null,
      })
      .returning();

    if (!newUser) {
      return {
          message: "Failed to create account",
          success:false
        }
    }

    // _____ Generate JWT ...
    const tokenPayload: Token = {
      accountId: newUser.id,
      email: newUser.email,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!);

    // _____ Set client cookie ...
    const clientCookies = await cookies();
    clientCookies.set("oms-auth-token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return {
        message: "Account created successfully",
        success:true,
        redirect: "/dashboard",
      }
  } catch (err) {
    console.log(err);
    return {
        message: "An error occurred while creating account",
        success:true,
      }
  }
};
export default CreateAccount;
