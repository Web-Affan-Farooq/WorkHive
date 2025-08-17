import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Body {
  name: string;
  organizationId: string;
}

export const POST = async (req: NextRequest) => {
  const body: Body = await req.json();

  try {
    const newDepartment = await prisma.department.create({
      data: {
        name: body.name,
        organizationId: body.organizationId,
      },
      select: {
        name: true,
        organizationId: true,
        id: true,
      },
    });
    return NextResponse.json(
      {
        message: "department created successfully",
        department: newDepartment,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log("Error : ", err);
    return NextResponse.json(
      {
        message: "An error occured",
      },
      {
        status: 500,
      }
    );
  }
};
