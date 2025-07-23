"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { EmployeeSignupFormSchema } from "@/validations";
import axios from "axios";
import { useRouter } from "next/navigation";

type EmployeeSignupFormData = z.infer<typeof EmployeeSignupFormSchema>;
interface Department {
    id: string;
    name: string;
    organizationId: string;
}
const OrganizationForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [disabled, setdisabled] = useState(false);
    const [departments, setdepartments] = useState<Department[]>([]);
    const [selectedDepartments, setselectedDepartments] = useState<Department[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<EmployeeSignupFormData>({
        resolver: zodResolver(EmployeeSignupFormSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: EmployeeSignupFormData) => {
        const payload = {
            ...data,
            departments:selectedDepartments,
        }
        console.log("Data :", payload);
        const response = await axios.post("/api/create-employee",payload)
        setdisabled(false)
    };

    const goNext = async () => {
        const values = getValues(["organizationId"]);
        console.log("Values : ", values);
        const allCleared = values.every((val) => val && val !== "")
        const verifyOrganization = await axios.post("/api/verify-org", {
            id: values[0],
        });
        if (allCleared && verifyOrganization.data.success) {
            setdepartments(verifyOrganization.data.departments);
            setStep(2);
        } else {
            alert("Please fill all the fields.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md max-sm:w-full bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                    Step {step} of 2
                </h2>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {step === 1 && (
                        <>
                            {/* orgId*/}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Organization id</label>
                                <input
                                    type="text"
                                    {...register("organizationId")}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="..."
                                />
                                {errors.organizationId && <p className="text-red-400 text-sm">{errors.organizationId.message}</p>}
                            </div>
                            <p className="text-sm text-green-400">This id can be sent by your organization admin</p>
                            <button
                                type="button"
                                onClick={goNext}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                            >
                                Verify
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* employee name */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    placeholder="abc"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
                            </div>
                            {/* employee email */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    placeholder="xyz@example.com"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
                            </div>

                            {/* employee password */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
                            </div>

                            {/* staffSize */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Select departments you want to associated with</label>
                                {JSON.stringify(departments)}
                                {departments.map((department, idx) => (
                                    <div key={idx} className="flex flex-row items-center gap-[8px]">
                                        <input type="checkbox" name={department.name} value={department.name} onSelect={(e) => {
                                            setselectedDepartments([...selectedDepartments, department])
                                        }} />
                                        <span className="text-sm text-green-600">{department.name}</span>
                                    </div>
                                ))}
                                {departments.length <= 0 && <p className="text-red-400 text-sm">Please select atleast one department</p>}
                            </div>

                            <button
                                type="submit"
                                className={`${disabled ? "bg-green-700" : "bg-green-500"} w-full hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition`}
                                onClick={() => {
                                    setdisabled(true)
                                }}
                            >
                                Create account
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrganizationForm;

/*
model Organization {
  id           String   @id @default(uuid())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  name         String
  industryType String
  address      String
  telephone    String
  email        String   @unique
  password     String
  users        Users[]
  maximumUsers Int
}

model Department {
  id    String               @id @default(uuid())
  name  String
  users UsersOnDepartments[]
}

model Users {
  id             String               @id @default(uuid())
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt
  name           String
  email          String               @unique
  password       String
  isManager      Boolean
  tasks          Task[]
  organization   Organization?        @relation(fields: [organizationId], references: [id])
  organizationId String
  departments    UsersOnDepartments[]
}

model UsersOnDepartments {
  user         Users      @relation(fields: [userId], references: [id])
  userId       String
  department   Department @relation(fields: [departmentId], references: [id])
  departmentId String

  @@id([userId, departmentId]) // composite primary key
}

model Task {
  id          String   @id @default(uuid())
  title       String
  description String
  assignedOn  DateTime @default(now())
  dueDate     DateTime

  // Many-to-many relation with users
  assignedTo  Users    @relation(fields: [userId], references: [id])
  userId      String
  completed   Boolean
  completedOn DateTime
}    read this schema , you've remember that i am creating an employee managemt system , you've  guided me to implement the flow of organization creation , now read this schema , dont write any code , just we have some brain storming , how to implement employee signup ?,    my recommendation is    first of all create  2 step form , which takes organizationid first and verify if organization exists, if organization exists , then we fetch departments in this organization , then in second step , it will take employee's name , email , password and display the department in select field so that can be easily selected by user then take this data to route , thirdly , w have to create a nextjs 15 backend route for taking the data and checking if user already exist , if user already exists, then we break the flow and told him to login instead of making another account , and if not user found we create user in Users table  . is it correct , 
*/