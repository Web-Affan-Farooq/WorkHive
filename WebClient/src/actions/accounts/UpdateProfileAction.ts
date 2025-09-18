"use server"
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { user } from "@/db/schemas";
import { eq } from "drizzle-orm";

type UpdateProfileRequest = {
  newName: string;
  newEmail: string;
};

type UpdateProfileResponse = {
  message: string;
  success:boolean
};

const UpdateProfile = async (body:UpdateProfileRequest):Promise<UpdateProfileResponse>=> {
  try {
    const payload = await GetTokenPayload();

    if (!payload) {
        return {
          message: "Unauthorized",
          success:false,
        }
    }
    const accountId = payload.accountId;

    await db
      .update(user)
      .set({ name: body.newName, email: body.newEmail })
      .where(eq(user.id, accountId));

    return { message: "User information updated successfully." ,success:true}
  } catch (error) {
    console.error("Update failed:", error);
    return { message: "Internal Server Error" , success:false }
  }
};
export default UpdateProfile;
