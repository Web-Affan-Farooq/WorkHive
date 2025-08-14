import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import { Token } from "@/@types/AuthToken";

type ResponseType = Token | null;
const GetTokenPayload =async (): Promise<ResponseType>=> {
    const clientCookies = await cookies();
    const token = clientCookies.get("oms-auth-token")?.value;
    if(!token) {
        return null;
    }
    const tokenPayload = jwt.verify(token,process.env.JWT_SECRET_KEY!);

    return tokenPayload as Token;
}

export default GetTokenPayload;