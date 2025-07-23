import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Body {
    name:string;
    email:string;
    password:string;
    organizationId:string;
}

export const POST = async (req:NextRequest) => {
    /* ____ Getting body and cookies ... */
    const {name,email , password , organizationId}:Body = await req.json();
    const clientCookies = await cookies();

    /* ____ Checking if account exists ... */
    const existingAccount = await prisma.users.findUnique({
        where : {
            email:email,
        }
    });
    if(existingAccount) {
        return NextResponse.json({
            message:"User already exists",
            success:false,
        },{status:400});
    }

    /* ____ Hashing password ... */
    const userPasswordHash = await bcrypt.hash(password, 10);

    /* ____ Creating account... */
    

    return NextResponse.json(
        {
            message:"Account created successfully"
        }
    )
}