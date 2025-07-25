"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { EmployeeLoginSchema } from "@/validations";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type EmployeeLoginFormData = z.infer<typeof EmployeeLoginSchema>;

const OrganizationForm = () => {
    /* ____ for controlling redirect ... */
    const router = useRouter();

    /* ____ for controlling two step form  ... */
    const [step, setStep] = useState(1);

    /* ____ for storing response data  ... */
    const [responseData, setResponseData] = useState<{
        status: boolean;
        organizationId: string;
        userId: string;
        message: string;
    }>({
        status: false,
        organizationId: "",
        userId: "",
        message: "",
    });

    /* ____ React hook form ... */
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<EmployeeLoginFormData>({
        resolver: zodResolver(EmployeeLoginSchema),
        mode: "onChange",
    });

    const goNext = async () => {
        /* ____ For proceeding one step furthur ... */
        const values = getValues(["organizationId"]);
        console.log("Values : ", values);
        const allCleared = values.every((val) => val && val !== "")
        const verifyOrganization = await axios.post("/api/organization/verify", {
            id: values[0],
        });
        if (allCleared && verifyOrganization.data.success) {
            setStep(2);
        } else {
            alert("Please fill all the fields.");
        }
    };

    const onSubmit = async (data: EmployeeLoginFormData) => {
        /* ____ Take form data and make a login request ... */
        const response = await axios.post("/api/employees/login", data);

        if (!response.data.success) {
            toast.error(response.data.message);
        }
        setResponseData({
            status: true,
            message: response.data.message,
            userId: response.data.userId,
            organizationId: response.data.organizationId,
        });
    };

    /* ____ useEffect : For runnning immportant logics upon successful account creation  ... */
    useEffect(() => {
        if (responseData.status) {
            router.push("/dashboard");
            window.localStorage.setItem("user-ID", responseData.userId)
            window.localStorage.setItem("org-ID", responseData.organizationId)
            toast.success(responseData.message);
        }
    }, [responseData,router])

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
                            {/* employee email */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("userEmail")}
                                    placeholder="xyz@example.com"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-500"
                                />
                                {errors.userEmail && <p className="text-red-400 text-sm">{errors.userEmail.message}</p>}
                            </div>

                            {/* employee password */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    {...register("userPassword")}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.userPassword && <p className="text-red-400 text-sm">{errors.userPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className={`bg-green-500 w-full hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition`}
                            >
                                Login
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrganizationForm;