import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface Department {
    id: string;
    name: string;
    userId: string;
}

interface Body {
    name: string;
    email: string;
    password: string;
    organizationId: string;
    departments: Department[],
}

export const POST = async (req: NextRequest) => {
    /* ____ Getting body and cookies ... */
    const { name, email, password, organizationId, departments }: Body = await req.json();
    console.log("Get body ::: Line 25 /api/employees/create     : ", { name, email, password, organizationId, departments })
    const clientCookies = await cookies();

    /* ____ Checking if account exists ... */
    const existingAccount = await prisma.users.findUnique({
        where: {
            email: email,
        }
    });
    if (existingAccount) {
        console.log("Line 35 /api/employees/create     user already exists")
        return NextResponse.json({
            message: "User already exists",
            success: false,
        }, { status: 400 });
    }

    /* ____ Hashing password ... */
    const userPasswordHash = await bcrypt.hash(password, 10);
    console.log("Hashed user password  ::: Line 44 /api/employees/create     : ", userPasswordHash)
    /* ____ Creating account... */
    const newUser = await prisma.users.create(
        {
            data: {
                name: name,
                email: email,
                password: userPasswordHash,
                organizationId: organizationId,
                isManager: false,
            }
        }
    );
    console.log("Created account  ::: Line 57 /api/employees/create     : ", newUser)

    /* Assigning departments ... */
    const departmentsPayload = departments.map((dept) => ({
        userId: newUser.id,
        departmentId: dept.id,
    }));
    console.log("Getting payload ready  ::: Line 63 /api/employees/create     : ", departmentsPayload)

    const assignedDepartments = await prisma.usersOnDepartments.createMany(
        {
            data: departmentsPayload
        }
    );
    console.log("Assigned departments  ::: Line 71 /api/employees/create     : ", assignedDepartments)
    const tokenPayload = {
        email: email,
        organizationId: organizationId,
    }
    console.log("Created token payload ::: Line 75 /api/employees/create     : ", tokenPayload)
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!,);
    console.log("Token ready  ::: Line 77 /api/employees/create     : ", token)

    clientCookies.set("organization-employee-token", token, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.json(
        {
            message: "Account created successfully",
            redirect: "/dashboard",
            organizationId: organizationId,
            userId: newUser.id,
            success:true,
        }
    )
}