import z from "zod";

const OrganizationLoginSchema = z.object(
    {
        organizationEmail:z.email("Invalid required"),
        orgPassword:z
        .string({ message: "Please Enter password" })
        .min(8, "Password must be at least 8 characters long")
        .max(10, "Password must be shorter than 10 characters")

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
).strict()
export default OrganizationLoginSchema;