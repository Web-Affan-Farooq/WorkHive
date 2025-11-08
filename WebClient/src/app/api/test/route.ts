import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


import db from "@/db";
import { eq } from "drizzle-orm";
import { department, organization, userDepartmentsJunction } from "@/db/schemas";
import { GetOwnedOrganizationTasks , GetOrganizationUsersWithDepartment,
  GetOrganizationUsersList
 } from "@/functions";

import { Department } from "@/@types/types";


export const GET = async (req: NextRequest) => {
  const accountId = "5722f038-2669-44ee-9b20-0ae7211c6377";

    const userJoinedDepartments = await db.query.userDepartmentsJunction.findMany(
      {
        where: eq(userDepartmentsJunction.userId, accountId),
        with: {
          department: true
        },
      }
    );

  return NextResponse.json({
    data: userJoinedDepartments,
  });
};
