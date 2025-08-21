import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import GetTokenPayload from "@/utils/GetTokenPayload";
import Logger from "@/lib/logger";
import jwt from "jsonwebtoken";

interface Body {
  token: string;
}
const logger = new Logger("/api/invite/verify");

export const POST = async (req: NextRequest) => {
  const body: Body = await req.json();
  logger.log(14, "Get body : ", body);
  logger.log(
    16,
    "get payload from invite token : ",
    jwt.verify(body.token, process.env.JWT_SECRET_KEY!)
  );
  // ____ Making sure that the user is authenticated ...
  const payload = await GetTokenPayload();
  if (!payload) {
    return NextResponse.json(
      {
        message: "Unauthorized access",
      },
      { status: 402 }
    );
  }
  logger.log(25, "Get payload : ", payload);

  // ____ Find required invitation  ...
  const requiredInvite = await prisma.invite.findUnique({
    where: {
      token: body.token,
    },
  });
  if (!requiredInvite) {
    return NextResponse.json(
      {
        message: "Not found",
      },
      { status: 404 }
    );
  }
  logger.log(41, "required invitation found : ", requiredInvite);

  const expirationDate = new Date(requiredInvite.expiresAt);
  const now = new Date();
  if (expirationDate < now) {
    return NextResponse.json(
      {
        message:
          "Your session hasbeen expired , please contact the owner of organization",
      },
      { status: 402 }
    );
  }

  await prisma.invite
    .update({
      where: {
        id: requiredInvite.id,
      },
      data: {
        status: "ACCEPTED",
      },
    })
    .then((data) => {
      logger.log(63, "invitation updated : ", data);
    });

  // ____ connect user to department ...
  const joinedDept = await prisma.department.update({
    where: {
      id: requiredInvite.departmentId,
    },
    data: {
      users: {
        connect: {
          id: payload.accountId,
        },
      },
    },
    select: {
      name: true,
      organization: {
        select: {
          name: true,
          userId: true,
        },
      },
    },
  });
  logger.log(90, "Joined department : ", joinedDept);
  // ____ Notify organization manager about user onboarding ...
  await prisma.notification
    .create({
      data: {
        title: "A new user has joined your organization",
        type: "SUCCESS",
        message: `A new user has joined ${joinedDept.name} department in ${joinedDept.organization.name}`,
        read: false,
        userId: joinedDept.organization.userId,
      },
    })
    .then((data) => {
      logger.log(101, "Pushed notification : ", data);
    });
  return NextResponse.json({
    message: "Organization joined successfully",
    redirect: "/dashboard/organizations",
  });
};
