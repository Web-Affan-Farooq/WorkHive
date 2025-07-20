import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { OrganizationSchema } from "@/validations";
import axios from "axios";

type OrganizationFormData = z.infer<typeof OrganizationSchema>;

const OrganizationForm = () => {
    const [step, setStep] = useState(1);
    const [disabled, setdisabled] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<OrganizationFormData>({
        resolver: zodResolver(OrganizationSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: OrganizationFormData) => {
        const numbers = data.staffSize.split(" ").filter((chunk) => typeof (Number(chunk)) === "number")
        const newData = {
            ...data,
            staffSize: {
                managers: Number(numbers[0]),
                employees: Number(numbers[2])
            }
        }
        console.log("New data : ",newData);
        
        const response = await axios.post("http://localhost:8000/create-organization",newData)
        console.log("Response : ", response.data);
        setdisabled(false)
    };

    const goNext = () => {
        const values = getValues(["orgName", "industryType", "orgAddress"]);
        if (values.every((val) => val && val !== "")) {
            setStep(2);
        } else {
            alert("Please fill all organization info fields.");
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
                            {/* orgName */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Organization Name</label>
                                <input
                                    type="text"
                                    {...register("orgName")}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Example firm Pvt Ltd"
                                />
                                {errors.orgName && <p className="text-red-400 text-sm">{errors.orgName.message}</p>}
                            </div>

                            {/* industryType */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Industry</label>
                                <select
                                    {...register("industryType")}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Industry</option>
                                    <option value="IT">IT</option>
                                    <option value="Education">Education</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.industryType && <p className="text-red-400 text-sm">{errors.industryType.message}</p>}
                            </div>

                            {/* orgAddress */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Address</label>
                                <textarea
                                    {...register("orgAddress")}
                                    rows={3}
                                    placeholder="Street, City, Zip Code"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.orgAddress && <p className="text-red-400 text-sm">{errors.orgAddress.message}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={goNext}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                            >
                                Continue to Contact Info
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            {/* orgEmail */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    {...register("orgEmail")}
                                    placeholder="organization@example.com"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.orgEmail && <p className="text-red-400 text-sm">{errors.orgEmail.message}</p>}
                            </div>

                            {/* orgPassword */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    {...register("orgPassword")}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.orgPassword && <p className="text-red-400 text-sm">{errors.orgPassword.message}</p>}
                            </div>

                            {/* orgPhone */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    {...register("orgPhone")}
                                    placeholder="+92 300 1234567"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.orgPhone && <p className="text-red-400 text-sm">{errors.orgPhone.message}</p>}
                            </div>

                            {/* staffSize */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Staff Size</label>
                                <select
                                    {...register("staffSize")}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Staff</option>
                                    <option value="4 heads, 10 employees">4 heads, 10 employees</option>
                                    <option value="10 heads, 40 employees">10 heads, 40 employees</option>
                                    <option value="20 heads, 100 employees">20 heads, 100 employees</option>
                                </select>
                                {errors.staffSize && <p className="text-red-400 text-sm">{errors.staffSize.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className={`${disabled? "bg-green-700":"bg-green-500"} w-full hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition`}
                                onClick={() => {
                                    setdisabled(true)
                                }}
                            >
                                Create Organization
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrganizationForm;
