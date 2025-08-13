//  /api/payment/create/route.ts ...

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import bcrypt from "bcrypt";
import { AccountInfo } from "@/@types/server/AccontPayload";
import Logger from "@/lib/logger";

/* ____ type body ... */
type Body = Pick<AccountInfo, "name" | "email" | "password" | "plan">

/* ____ Stripe instance ... */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-07-30.basil",
});

/* ___ Stripe pricing ... */
const prices: Record<"TEAMS" | "PRO" | "FREE", string> = {
    TEAMS: process.env.STRIPE_TEAMS!,
    PRO: process.env.STRIPE_PRO!,
    FREE: "" // only for maintaining type flow , FREE cant be sent from client
}

const logger = new Logger("/api/payment/create/");

export const POST = async (req: NextRequest) => {
    const body: Body = await req.json();
    logger.log(27, "Get body : ", body);

    /* ____ Call the payment handler ... */
    logger.log(30, "Calling payment handler : ", "")
    const urls = {
        success: new URL("/payment-success", req.url).toString(),
        failed: new URL("/payment-failed", req.url).toString()
    }

    try {
        const hashPassword = await bcrypt.hash(body.password, 10);
        /* ____ Create customer ... */
        const customer = await stripe.customers.create(
            {
                email: body.email,
                name: body.name,
            }
        );

        logger.log(46, "Created customer  : ", customer);

        /* ____ Create payment ... */
        const session = await stripe.checkout.sessions.create(
            {
                mode: "subscription",
                payment_method_types: ["card"],
                customer: customer.id,
                line_items: [
                    {
                        price: prices[body.plan],
                        quantity: 1
                    }
                ],
                metadata: {
                    name: body.name,
                    email: body.email,
                    password: hashPassword,
                    plan: body.plan
                },
                success_url: urls.success,
                cancel_url: urls.failed,
                expand: ['subscription']
            }
        );
        logger.log(71, "Created payment : ", session);

        /* ____ return values ... */
        return NextResponse.json(
            {
                message: "Payment completed successfully",
                url: session.url,
            },
            {
                status: 200
            }
        )
    } catch (err) {
        /* ____ return values ... */
        console.log("Error : ", err);
        return NextResponse.json(
            {
                message: "An error occured while creating subscription",
                url: urls.failed,
            },
            {
                status: 402,
            }
        )
    }
}