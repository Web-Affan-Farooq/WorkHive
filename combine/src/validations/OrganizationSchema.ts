import * as z from "zod";

const OrganizationSchema = z.object(
    {
        /* Step 1 */
        orgName: z.string("Invalid name").min(7, "Minimum 7 characters required").max(20, "Maximum 16 characters required"),
        industryType: z.string(),
        orgAddress: z.string().min(20).max(100, "Address can be maximum 100 characters long"),

        /* Step 2 */
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
        staffSize: z.number("Please use digits").min(5, "Atleast 5 users required").max(40, "Maximum 40 users allowed"),

                /* Step 3 */
        userName: z.string("Invalid name").min(2, "Minimum 7 characters required").max(20, "Maximum 20 characters required"),
        userEmail: z.email(),
        userPassword: z
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
    }
).strict()

export default OrganizationSchema;