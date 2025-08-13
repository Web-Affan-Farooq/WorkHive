import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import CreateAccount from "@/utils/CreateAcocunt";

// ____ types ... 
import { AccountInfo } from "@/@types/server/AccontPayload";

export const POST = async (req: NextRequest) => {
    /* ____ Getting body and cookies ... */
    const body: AccountInfo = await req.json();
    const response = await CreateAccount(body);

    return NextResponse.json(
        {
            message: response.message,
            redirect: response.redirect,
        },
        {
            status: response.status,
        }
    )
}