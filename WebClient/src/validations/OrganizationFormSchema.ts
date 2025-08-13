import * as z from "zod";

const OrganizationFormSchema = z.object(
    {
        organizationName: z.string("Invalid name").min(7, "Minimum 7 characters required").max(20, "Maximum 16 characters required"),
        organizationEmail: z.email("Invalid email"),
        organizationPassword: z
            .string({ message: "Please Enter password" })
            .min(8, "Password must be at least 8 characters long")
            .max(12, "Password must be shorter than 12 characters")

            // _____ Validate lowercase characters 
            .refine((val) => /[a-z]/.test(val), {
                message: "Password must include lowercase characters"
            })

            // _____ Validate uppercase characters
            .refine((val) => /[A-Z]/.test(val), {
                message: "Password must include lowercase characters"
            })

            // _____ Validate numbers characters 
            .refine((val) => /\d/.test(val), {
                message: "Password must include digits"
            })

            // _____ Validate lowercase characters 
            .refine((val) => /[@$!%*?&]/.test(val), {
                message: "Password must include special characters"
            }),
    }
).strict();

export default OrganizationFormSchema;