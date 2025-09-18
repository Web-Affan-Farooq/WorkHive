"use server"
import bcrypt from "bcrypt";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { user } from "@/db/schemas";
import { eq } from "drizzle-orm";

type ChangePasswordAPIResponse = {
  message:string;
  success:boolean;
}

const ChangePassword = async (newPassword:string):Promise<ChangePasswordAPIResponse>=> {
  try {
    const payload = await GetTokenPayload();

    if (!payload) {
      return {
          message: "Unauthorized",
          success:false
        }
    }

    const accountId = payload.accountId;

    //  _____ password must be hashed before updating ...
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
      .update(user)
      .set({
        password: hashedPassword,
      })
      .where(eq(user.id, accountId));
    return {
        message: "Password changed successfully",
        success:true,
      }
  } catch (error) {
    console.error("Error changing password:", error);
    return { message: "Something went wrong." ,success:false}
  }
};
export default ChangePassword;
