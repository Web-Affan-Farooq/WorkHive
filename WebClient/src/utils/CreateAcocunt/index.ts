import { Token } from "@/@types/AuthToken";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

/* ____ Type definitions ____ */
import {
  AccountInfo,
  CreateAccountResponse,
} from "@/@types/server/AccontPayload";

const CreateAccount = async (data: AccountInfo): CreateAccountResponse => {
  /* ____ Use this function for creating account ... this module can be capable of creating both free and paid account types ____ */
  try {
    /* _____ Create account if not already exists ...  */
    const alreadyExists = await prisma.accounts.findUnique({
      where: {
        email: data.email,
      },
    });
    if (alreadyExists) {
      return {
        message: "Account already exists",
        status: 422,
        redirect: null,
      };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.accounts.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, // password already hashed
        plan: data.plan,
        stripeCustomerId: data.customerId,
        stripeSubId: data.subscriptionId,
      },
    });

    /* _____ Generate token  */
    const tokenPayload: Token = {
      accountId: newUser.id,
      email: newUser.email,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!);

    /* _____ Setting client cookies  */
    const clientCookies = await cookies();
    clientCookies.set("oms-auth-token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return {
      message: "Account created successfully",
      status: 201,
      redirect: "/dashboard",
    };
  } catch (err) {
    console.error("❌ Account creation error:", err);
    return {
      message: "An error occurred while creating account",
      status: 500,
      redirect: null,
    };
  }
};

export default CreateAccount;
