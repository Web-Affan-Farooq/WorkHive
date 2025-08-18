import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import * as z from "zod";
import { OrganizationFormSchema } from "@/validations";
import Logger from "@/lib/logger";
import GetTokenPayload from "@/utils/GetTokenPayload";

const logger = new Logger("/api/organizations/create");

/** Type defination for request body */
type Body = z.infer<typeof OrganizationFormSchema>;

export const POST = async (req: NextRequest) => {
  try {
    /* ____ Get body and cookies ... */
    const body: Body = await req.json();
    logger.log(43, "Get body : ", body);

    /* ____ Check if org email already exists ... */
    const existingOrg = await prisma.organization.findUnique({
      where: { organizationEmail: body.organizationEmail },
    });
    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization email already exists" },
        { status: 400 }
      );
    }

    /* ____ Get auth token --> extract account id from it  ... */
    const payload = await GetTokenPayload();

    if (!payload) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const accountId = payload.accountId;

    logger.log(41, "Get account id from token : ", accountId);

    /* ____ Hash organization password ... */
    const orgPasswordHash = await bcrypt.hash(body.organizationPassword, 10);
    logger.log(47, "Hashed password of org : ", orgPasswordHash);

    /* ____ Create organization ... */
    const newOrg = await prisma.organization.create({
      data: {
        name: body.organizationName,
        organizationEmail: body.organizationEmail,
        organizationPassword: body.organizationPassword,
        userId: accountId, // ____ Ignore this error
      },
    });

    logger.log(59, "Created new organization : ", newOrg);

    return NextResponse.json(
      {
        message: "Organization created successfully",
        organization: newOrg,
        redirect: "/dashboard/organizations",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during organization creation :", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
