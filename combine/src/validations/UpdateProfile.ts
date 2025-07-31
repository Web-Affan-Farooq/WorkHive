import * as z from "zod";

const UpdateProfileSchema = z.object(
    {
        newName : z.string("Invalid name").min(7, "Minimum 7 characters required").max(20, "Maximum 16 characters required"),
        newEmail: z.email(),
    }
).strict();

export default UpdateProfileSchema 