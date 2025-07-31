import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt"; // Make sure to install bcryptjs

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully.", success:true, }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Something went wrong.", success:false }, { status: 500 });
  }
}
