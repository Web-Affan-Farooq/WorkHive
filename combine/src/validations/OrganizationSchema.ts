import * as z from "zod";

const OrganizationSchema = z.object(
    {
        orgName: z.string("Invalid name").min(7, "Minimum 7 characters required").max(20, "Maximum 16 characters required"),
        orgEmail: z.email(),
        orgPassword: z
            .string({ message: "Please Enter password" })
            .min(8, "Password must be at least 8 characters long")
            .max(12, "Password must be shorter than 10 characters")

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
        orgPhone: z.string().min(10).max(15),
        industryType: z.string(),
        orgAddress: z.string().min(20).max(50, "Address can be maximum 30 characters long"),
        staffSize: z.string().min(1, "Please select staff size"),

    }
).strict()

export default OrganizationSchema;