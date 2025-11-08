"use server"
import bcrypt from "bcrypt";
import * as z from "zod";
import { OrganizationFormSchema } from "@/validations";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { organization } from "@/db/schemas";
import { eq, InferInsertModel } from "drizzle-orm";

/* Type defination for request body */
type CreateOrganizationRequest = z.infer<typeof OrganizationFormSchema>;

type CreateOrganizationResponse = {
  message: string;
  success:boolean;
  redirect?: "/dashboard/organizations";
  organization?: {
    name: string;
    organizationEmail: string;
    userId: string;
  };
}

const CreateOrganizationAction = async (body:CreateOrganizationRequest):Promise<CreateOrganizationResponse> => {
  try {
    /* ____ Check if org email already exists ... */
    const existingOrgList = await db
      .select()
      .from(organization)
      .where(eq(organization.organizationEmail, body.organizationEmail));

    if (existingOrgList.length > 0) {
      return {
          message: "Organization email already exists",
          success:false,
        }
    }

    /* ____ Get auth token --> extract account id from it  ... */
    const payload = await GetTokenPayload();

    if (!payload) {
      return {
          message: "Unauthorized",
          success:false
        }
    }
    const accountId = payload.accountId;

    /* ____ Hash organization password ... */
    const orgPasswordHash = await bcrypt.hash(body.organizationPassword, 10);

    /* ____ Create organization ... */
    const newOrg: InferInsertModel<typeof organization> = {
      name: body.organizationName,
      organizationEmail: body.organizationEmail,
      organizationPassword: orgPasswordHash,
      userId: accountId,
    };
    await db.insert(organization).values(newOrg);

    return {
        message: "Organization created successfully",
        success:true,
        organization: {
          name: body.organizationName,
          organizationEmail: body.organizationEmail,
          userId: accountId,
        },
        redirect: "/dashboard/organizations",
      }
  } catch (error) {
    console.error("Error during organization creation :", error);
    return { message: "Internal Server Error", success:false }  }
};
export default CreateOrganizationAction;