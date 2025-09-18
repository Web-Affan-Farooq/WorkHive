import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
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
  redirect: "/dashboard" | null;
};

type CreateAccountRequest = {
  name: string;
  email: string;
  password: string;
  plan: PlanType;
  customerId: string | null;
  subscriptionId: string | null;
};

export type { CreateAccountRequest, CreateAccountResponse };

const CreateAccount = async (req: NextRequest) => {
  /* ____ Getting body and cookies ... */
  const body: CreateAccountRequest = await req.json();
  try {
    // _____ Check if account already exists ...
    const alreadyExists = await db
      .select()
      .from(user)
      .where(eq(user.email, body.email));

    if (alreadyExists.length > 0) {
      return NextResponse.json(
        {
          message: "Account already exists",
          redirect: null,
        },
        {
          status: 422,
        }
      );
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
        stripeCustomerId: body.customerId,
        stripeSubId: body.subscriptionId,
      })
      .returning();

    if (!newUser) {
      return NextResponse.json(
        {
          message: "Failed to create account",
          redirect: null,
        },
        {
          status: 500,
        }
      );
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

    return NextResponse.json(
      {
        message: "Account created successfully",
        redirect: "/dashboard",
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occurred while creating account",
        redirect: null,
      },
      {
        status: 500,
      }
    );
  }
};
export default CreateAccount;
