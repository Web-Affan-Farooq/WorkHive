import z from "zod";
// import { departments } from "../constants/constants";

const LoginSchema = z.object(
    {
        employeeId: z.number("numeric id is required").min(1, "Invalid id").max(1000,"Invalid id"),
        employeeEmail: z.email("Invalid required"),
        employeePassword:z
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
        employeeDepartment:z.string().min(1,"Please select a department").max(15,"department name is too big")
    }
).strict()
export default LoginSchema;