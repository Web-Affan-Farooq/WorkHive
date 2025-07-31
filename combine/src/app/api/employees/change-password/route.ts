import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt"; 

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedAccount = await prisma.users.update({
      where: { email },
      data: { password: hashedPassword },
    });
    console.log("Line 30 /api/employees/change-password   PUT   ::: updated user account successfully :  ",updatedAccount);    

    return NextResponse.json({ message: "Password updated successfully.", success: true, }, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ message: "Something went wrong.", success: false }, { status: 500 });
  }
}
