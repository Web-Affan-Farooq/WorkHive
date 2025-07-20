import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const POST = async (req:NextRequest) => {
    
    return NextResponse.json(
        {
            message:"Account created successfully"
        }
    )
}