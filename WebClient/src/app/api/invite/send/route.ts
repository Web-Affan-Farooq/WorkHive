import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { InvitationSchema } from "@/validations";
import { Resend } from "resend";

type Body = z.infer<typeof InvitationSchema>;

export const POST = async (req: NextRequest) => {
  const resend = new Resend(process.env.RESEND_AUTH_TOKEN);
  const body: Body = await req.json();

  // ✅ Check if invitee already has an account
  const requiredUser = await prisma.accounts.findUnique({
    where: { email: body.inviteeEmail },
  });

  if (!requiredUser) {
    return NextResponse.json(
      { message: "Please make sure user has an account with this email" },
      { status: 404 }
    );
  }

  // ⏳ Expiration duration
  const expiresIn = "24h";

  const tokenPayload = {
    inviteeEmail: body.inviteeEmail,
    departmentId: body.departmentId,
  };

  const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!, {
    expiresIn,
  });

  // Expiration date for DB (24h from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // ✅ Check if an active invite already exists
  const existingInvite = await prisma.invite.findFirst({
    where: {
      inviteeEmail: body.inviteeEmail,
      departmentId: body.departmentId,
      status: "PENDING",
      expiresAt: { gt: new Date() }, // still valid
    },
  });

  let inviteToken = token;

  if (existingInvite) {
    // 👀 Reuse existing invite
    inviteToken = existingInvite.token;
  } else {
    // 🚀 Create a fresh invite
    await prisma.invite.create({
      data: {
        inviteeEmail: body.inviteeEmail,
        departmentId: body.departmentId,
        token: token,
        expiresAt: expiresAt,
        organizationEmail: body.organizationEmail,
        status: "PENDING",
      },
    });
  }

  // 📧 Send email
  await resend.emails.send({
    from: `onboarding@resend.dev`,
    to: body.inviteeEmail,
    subject: "You're invited",
    html: `<p>Click <a href="localhost:3000/invite/${inviteToken}">here</a> to accept the invite. This link will expire in 24 hours.</p>`,
  });

  return NextResponse.json({ message: "Invitation sent" }, { status: 200 });
};
