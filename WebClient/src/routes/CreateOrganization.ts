import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as z from "zod";
import { OrganizationFormSchema } from "@/validations";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { organizations } from "@/schemas";
import { eq, InferInsertModel } from "drizzle-orm";

/* Type defination for request body */
type CreateOrganizationRequest = z.infer<typeof OrganizationFormSchema>;
type CreateOrganizationResponse = {
  message: string;
  redirect: "/dashboard/organizations" | null;
  organization: {
    name: string;
    organizationEmail: string;
    userId: string;
  } | null;
};

export type { CreateOrganizationRequest, CreateOrganizationResponse };

const CreateOrganization = async (req: NextRequest) => {
  try {
    /* ____ Get body and cookies ... */
    const body: CreateOrganizationRequest = await req.json();

    /* ____ Check if org email already exists ... */
    const existingOrgList = await db
      .select()
      .from(organizations)
      .where(eq(organizations.organizationEmail, body.organizationEmail));

    if (existingOrgList.length > 0) {
      return NextResponse.json(
        {
          message: "Organization email already exists",
          redirect: null,
          organization: null,
        },
        { status: 400 }
      );
    }

    /* ____ Get auth token --> extract account id from it  ... */
    const payload = await GetTokenPayload();

    if (!payload) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          redirect: null,
          organization: null,
        },
        {
          status: 401,
        }
      );
    }
    const accountId = payload.accountId;

    /* ____ Hash organization password ... */
    const orgPasswordHash = await bcrypt.hash(body.organizationPassword, 10);

    /* ____ Create organization ... */
    const newOrg: InferInsertModel<typeof organizations> = {
      name: body.organizationName,
      organizationEmail: body.organizationEmail,
      organizationPassword: orgPasswordHash,
      userId: accountId,
    };
    await db.insert(organizations).values(newOrg);

    return NextResponse.json(
      {
        message: "Organization created successfully",
        organization: {
          name: body.organizationName,
          organizationEmail: body.organizationEmail,
          userId: accountId,
        },
        redirect: "/dashboard/organizations",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during organization creation :", error);
    return NextResponse.json(
      { message: "Internal Server Error", redirect: null, organization: null },
      { status: 500 }
    );
  }
};
export default CreateOrganization;
