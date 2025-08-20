import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();

  try {
    await prisma.notification.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json(
      {
        message: "Notification delete",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured while deleting notification",
      },
      {
        status: 500,
      }
    );
  }
};
