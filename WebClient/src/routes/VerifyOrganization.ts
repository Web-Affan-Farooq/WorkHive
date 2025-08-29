import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";

import { organizations } from "@/schemas";
import { eq } from "drizzle-orm";

const VerifyOrganization = async (req: NextRequest) => {
  const { id } = await req.json();
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
  if (!id) {
    return NextResponse.json(
      {
        message: "Id not found",
      },
      {
        status: 400,
      }
    );
  }
  const requiredOrganization = await db.query.organizations.findFirst({
    where: eq(organizations.id, id),
    with: {
      departments: true,
    },
  });

  if (requiredOrganization) {
    return NextResponse.json(
      {
        departments: requiredOrganization.departments, // ignore the type error
        organizationId: id,
        message: "Organization found",
      },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json(
      {
        departments: null,
        organizationId: id,
        message: "Organization not found",
      },
      {
        status: 404,
      }
    );
  }
};
export default VerifyOrganization;
