"use server"
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { department, organization } from "@/db/schemas";
import { eq, InferSelectModel } from "drizzle-orm";

type Response = {
  message: string;
  success: boolean;
  departments?: InferSelectModel<typeof department>[];
};


const VerifyOrganization = async (id: string): Promise<Response> => {
  const payload = await GetTokenPayload();
  if (!payload) {
    return {
      message: "Unauthorized",
      success: false,
    };
  }
  if (!id) {
    return {
      message: "Id not found",
      success: false,
    };
  }
  const requiredOrganization = await db.query.organization.findFirst({
    where: eq(organization.id, id),
    with: {
      departments: true,
    },
  });

  if (requiredOrganization) {
    return {
      departments: requiredOrganization.departments, // ignore the type error
      message: "Organization found",
      success: true,
    };
  } else {
    return {
      message: "Organization not found",
      success: false,
    };
  }
};
export default VerifyOrganization;
