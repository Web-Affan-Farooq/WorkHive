import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req:NextRequest) => {
    const clientCookies = await cookies();
    const body = await req.json();
    return NextResponse.json({
        message:"Login successfull"
    })
}