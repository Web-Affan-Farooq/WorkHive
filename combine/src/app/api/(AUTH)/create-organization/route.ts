import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Organization } from "@/@types/CreateOrganization";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    const body: Organization = await req.json();
    console.log(body);
    
    // Check if email already exists
    const existingOrg = await prisma.organization.findUnique({
      where: {
        email: body.orgEmail,
      },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.orgPassword, 10);

    // Create new organization
    const newOrg = await prisma.organization.create({
      data: {
        name: body.orgName,
        industryType: body.industryType,
        address: body.orgAddress,
        telephone: body.orgPhone,
        email: body.orgEmail,
        password: hashedPassword,
        maximumEmployees: body.staffSize.employees,
        maximumManagers: body.staffSize.managers,
      },
    });

    return NextResponse.json(
      {
        message: "Organization account created successfully",
        organization: newOrg,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
