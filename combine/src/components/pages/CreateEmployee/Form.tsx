"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { EmployeeSignupFormSchema } from "@/validations";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type EmployeeSignupFormData = z.infer<typeof EmployeeSignupFormSchema>;
interface Department {
    id: string;
    name: string;
    organizationId: string;
}
const OrganizationForm = () => {
    /* ____ for controlling redirect ... */
    const router = useRouter();

    /* ____ for controlling two step form  ... */
    const [step, setStep] = useState(1);

    /* ____ for storing fetched departments ... */
    const [departments, setdepartments] = useState<Department[]>([]);

    /* ____ For disabling button ... */
    const [disabled, setDisabled] = useState(false);

    /* ____ for storing selected departments ... */
    const [selectedDepartments, setselectedDepartments] = useState<Department[]>([]);

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
    } = useForm<EmployeeSignupFormData>({
        resolver: zodResolver(EmployeeSignupFormSchema),
        mode: "onChange",
    });

    const goNext = async () => {
        setDisabled(true)
        try {
            /* ____ For proceeding one step furthur ... */
            const values = getValues(["organizationId"]);
            // console.log("Values : ", values);
            const allCleared = values.every((val) => val && val !== "")
            if (allCleared) {
                const verifyOrganization = await axios.post("/api/organization/verify", {
                    id: values[0],
                });
                setdepartments(verifyOrganization.data.departments);
                setStep(2);
                setDisabled(false)
            } else {
                alert("Please fill all the fields.");
                setDisabled(false);
            }
        } catch (err) {
            console.log(err);
            toast.error("An error occured");
            setDisabled(false);
        }
    };

    const onSubmit = async (data: EmployeeSignupFormData) => {
        setDisabled(true);
        try {
            /* ____ Take form data , attached selected departments and request for account creation ... */
            const payload = {
                ...data,
                departments: selectedDepartments,
            }
            // console.log("Data :", payload);
            const response = await axios.post("/api/employees/create", payload);

            if (!response.data.success) {
                toast.error(response.data.message);
                setDisabled(false);
            }
            
            setResponseData({
                status: true,
                message: response.data.message,
                userId: response.data.userId,
                organizationId: response.data.organizationId,
            });
            setDisabled(false)
        } catch (err) {
            console.log(err);
            toast.error("An error occured");
            setDisabled(false)
        }
    };

    /* ____ useEffect : For runnning immportant logics upon successful account creation  ... */
    useEffect(() => {
        if (responseData.status) {
            router.push("/dashboard");
            window.localStorage.setItem("user-ID", responseData.userId)
            window.localStorage.setItem("org-ID", responseData.organizationId)
            toast.success(responseData.message);
        }
    }, [responseData, router])

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
                                className={`w-full ${disabled ? "bg-blue-700 cursor-not-allowed" : "bg-blue-600 cursor-pointer"} hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition`}>
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

                            {/* departments  */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Select departments you want to associated with</label>
                                {departments.map((department, idx) => (
                                    <div key={idx} className="flex flex-row items-center gap-[8px]">
                                        <input type="checkbox" name={department.name} value={department.name} onChange={(e) => {
                                            if (e.target.checked) {
                                                setselectedDepartments([...selectedDepartments, department])
                                            }
                                            else {
                                                const filtered = selectedDepartments.filter((dept) => (dept.id !== department.id));
                                                setselectedDepartments(filtered)
                                            }

                                        }} />
                                        <span className="text-sm text-green-600">{department.name}</span>
                                    </div>
                                ))}
                                {selectedDepartments.length <= 0 && <p className="text-red-400 text-sm">Please select atleast one department</p>}
                            </div>

                            <button
                                type="submit"
                                className={`w-full ${disabled ? "bg-green-700 cursor-not-allowed" : "bg-green-500 cursor-pointer"} hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition`}
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