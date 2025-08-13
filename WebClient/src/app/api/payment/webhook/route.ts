//  ______ /api/payments/webhook/route.ts
//  ______ POST
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import Logger from "@/lib/logger";
import CreateAccount from "@/utils/CreateAcocunt";

/* ____ Type definitions ____ */
import { PlanType } from "@/@types/server/AccontPayload";

/* ____ Stripe instance ____ */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

const logger = new Logger("/api/payments/webhook")

export const POST = async (req: NextRequest) => {
  const sig = req.headers.get("stripe-signature")!;
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  logger.log(36, "Signature : ", sig)
  logger.log(37, "buffer : ", buf)
  logger.log(38, "body from buffer : ", body)
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(47, "✅ Stripe Event: ", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  /* ---- Handle checkout success ---- */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const metadata = session.metadata;

    logger.log(60, "session : ", session)

    try {
      if (metadata) {
        /* ____ Create Account Helper ____ */
        const response = await CreateAccount({
          name: metadata.name,
          email: metadata.email,
          password: metadata.password,
          plan: metadata.plan as PlanType,
          customerId: customerId,
          subscriptionId: subscriptionId,
        });
        return NextResponse.json({
          message: response.message,
          redirect: response.redirect
        }, { status: response.status });
      }
    } catch (err) {
      console.error("❌ Error creating account:", err);
      return NextResponse.json({
        message: "An error occurred while creating your account",
      });
    }
  }

  /* ---- Handle subscription downgrade ---- */
  if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    if (subscription) {
      const account = await prisma.accounts.findUnique({
        where: { stripeSubId: subscription.id },
      });

      if (!account) return;

      if (["past_due", "unpaid", "canceled"].includes(subscription.status)) {
        await prisma.accounts.update({
          where: { id: account.id },
          data: { plan: "FREE" },
        });
        console.log("🔁 Downgraded user to FREE due to:", subscription.status);
      }
    }
  }

  return new NextResponse("Webhook processed", { status: 200 });
};