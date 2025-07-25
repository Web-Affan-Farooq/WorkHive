import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import z from "zod";
import { EmployeeLoginSchema } from "@/validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import {prisma} from "@/lib/prisma";

export const POST = async (req:NextRequest) => {
    const clientCookies = await cookies();
    const {organizationId,userEmail, userPassword}: z.infer<typeof EmployeeLoginSchema>= await req.json();

    /* verify user ... */
    const requiredUser = await prisma.users.findUnique(
        {
            where: {
                email:userEmail,
            }
        }
    );
    if(!requiredUser) {
    return NextResponse.json({
        message:"User not found",
        success:false,
    })
    }

    const passwordMatched = bcrypt.compare(userPassword,requiredUser.password);

    if(!passwordMatched) {
            return NextResponse.json({
        message:"Invalid password",
        success:false,
    })
    }

    const payload = {
        email:userEmail,
        organizationId:organizationId,
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET_KEY!);

    clientCookies.set("organization-employee-token",token,{
        httpOnly:true,
        path:"/",
        sameSite:"lax",
        maxAge:60*60*24*30
    });

    return NextResponse.json(
        {
            message:"Login successfull",
            redirect:"/dashboard",
            userId:requiredUser.id,
            organizationId:organizationId,
            success:true,
        }
    )
}