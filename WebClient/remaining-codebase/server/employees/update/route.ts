import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id,newEmail, newName } = body;

    if (!newEmail || !newName || !id) {
      return NextResponse.json({ error: "id , new email, and new name are required." }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Update name and email
    const updatedUser = await prisma.users.update({
      where: { id },
      data: {
        name:newName,
        email: newEmail,
      },
    });

    return NextResponse.json(
      { message: "User information updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
