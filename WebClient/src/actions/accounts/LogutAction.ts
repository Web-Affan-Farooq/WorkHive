"use server"
import { cookies } from "next/headers"

const LogoutAction = async ():Promise<{
    message:string;
    success:boolean
}> => {
    const clientCookies = await cookies();
    clientCookies.delete("oms-auth-token")
    return {
        message:"Logout successfull",
        success:true
    }
}

export default LogoutAction