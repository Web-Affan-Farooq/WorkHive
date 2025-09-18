"use server"
import GetTokenPayload from "@/utils/GetTokenPayload";
import { user } from "@/db/schemas";
import db from "@/db";
import { eq } from "drizzle-orm";

type DeleteAccountResponse = {
  message: string;
  success:boolean
};
const DeleteAccount = async ():Promise<DeleteAccountResponse> => {
  const payload = await GetTokenPayload();

  if (!payload) {
    return{
        message: "Unauthorized",
        success:false,
      }
  }
  const accountId = payload.accountId;

  try {
    await db.delete(user).where(eq(user.id, accountId));
    return {
        message: "Account deleted successfully",
        success:true
      }
  } catch (err) {
    console.log(err);
    return {
        message: "An error occured",
        success:false
      }
  }
};
export default DeleteAccount;
