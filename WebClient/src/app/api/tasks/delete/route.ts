import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const DELETE = async (req: NextRequest) => {
  const { id } = await req.json();
  try {
    await prisma.task
      .delete({
        where: {
          id: id,
        },
      })
      .then(() =>
        console.log("Line 14  DELETE   :::: Task deleted successfully...")
      );
    return NextResponse.json(
      {
        message: "Task deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
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
