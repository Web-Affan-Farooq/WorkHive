import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";

interface Body {
  selectedDepartmentId: string;
}

export const POST = async (req: NextRequest) => {
  const body: Body = await req.json();
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
  try {
    await prisma.department.update({
      where: {
        id: body.selectedDepartmentId,
      },
      data: {
        users: {
          connect: {
            id: accountId,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Organization joined successfully",
      redirect: "/dashboard",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "An error occured",
      redirect: "/dashboard",
    });
  }
};
