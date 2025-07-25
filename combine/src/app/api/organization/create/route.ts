import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

/** Type defination for request body */
interface Body {
  industryType: string;
  orgAddress: string;
  orgEmail: string;
  orgName: string;
  orgPassword: string;
  orgPhone: string;
  staffSize: number;
  userEmail: string;
  userName: string;
  userPassword: string;
  departments: string[]; // e.g., ["HR", "Engineering", "Sales"]
}

export const POST = async (req: NextRequest) => {
  try {
    const body: Body = await req.json();
    console.log("Get body ::: Line 26 /api/create-org     : ",body)
    const clientCookies = await cookies();

    // Check if org email already exists
    const existingOrg = await prisma.organization.findUnique({
      where: { email: body.orgEmail },
    });
    const existingUser = await prisma.users.findUnique({
      where: { email: body.userEmail },
    });
    const isAlreadyManager = await prisma.organization.findFirst({
      where: {
        users: {
          some: {
            email: body.userEmail,
          },
        },
      },
    });

    if (existingOrg || existingUser || isAlreadyManager) {
      return NextResponse.json(
        { error: "Organization email already exists" },
        { status: 400 }
      );
    }

    // Hash organization password
    const orgPasswordHash = await bcrypt.hash(body.orgPassword, 10);
        console.log("Hashed password of org    :::    Line 55   /api/create-org     : ",orgPasswordHash)
    // Create Organization
    const newOrg = await prisma.organization.create({
      data: {
        name: body.orgName,
        industryType: body.industryType,
        address: body.orgAddress,
        telephone: body.orgPhone,
        email: body.orgEmail,
        password: orgPasswordHash,
        maximumUsers: body.staffSize,
      },
    });
            console.log("Created org    :::    Line 68   /api/create-org     : ",newOrg)


    // Hash user (manager) password
    const userPasswordHash = await bcrypt.hash(body.userPassword, 10);
        console.log("Hashed password of manager    :::    Line 73   /api/create-org     : ",userPasswordHash)

    // Create Manager User
    const newUser = await prisma.users.create({
      data: {
        name: body.userName,
        email: body.userEmail,
        password: userPasswordHash,
        isManager: true,
        organizationId: newOrg.id,
      },
    });
            console.log("Created user's account    :::    Line 85   /api/create-org     : ",orgPasswordHash)

    // Create departments & connect manager to them
    const createdDepartments = await Promise.all(
      body.departments.map(async (deptName,idx) => {
        const department = await prisma.department.create({
          data: {
            name: deptName,
            organizationId:newOrg.id,
            users: {
              create: {
                userId: newUser.id,
              },
            },
          },
        });
                console.log(`Created department    ${idx} :::    Line 101   /api/create-org     : ${department}`)
        return department;
      })
    );

    const payload = {
      email: newUser.email,
      isManager: true,
      organizationId: newUser.organizationId
    }

            console.log("Payload for creating token   :::    Line 112   /api/create-org     : ",payload)

    const token1 = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
            console.log("Create jwt token    :::    Line 55   /api/create-org     : ",token1)
    
    clientCookies.set("organization-manager-token", token1, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax"
    });

    return NextResponse.json(
      {
        message: "Organization, manager, and departments created successfully",
        organization: newOrg,
        manager: newUser,
        departments: createdDepartments,
        redirect:"/organization"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
