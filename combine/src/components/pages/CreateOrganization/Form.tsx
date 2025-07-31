"use client"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { OrganizationSchema } from "@/validations";
import axios from "axios";
import { useRouter } from "next/navigation";
import { X } from 'lucide-react';
import toast from "react-hot-toast";

type OrganizationFormData = z.infer<typeof OrganizationSchema>;

const OrganizationForm = () => {
    /* ____ For redirecting logic ... */
    const router = useRouter();

    /* ____ For controlling form steps ... */
    const [step, setStep] = useState(1);
    // const [disabled, setdisabled] = useState(false);

    /* ____ For controlling departments input ... */
    const [department, setdepartment] = useState("");

    /* ____ For disabling button ... */
    const [disabled, setDisabled] = useState(false);

    /* ____ For storing selected departments ... */
    const [departments, setdepartments] = useState<string[]>([]);

    /* ___ react hook form ... */
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm<OrganizationFormData>({
        resolver: zodResolver(OrganizationSchema),
        mode: "onChange",
    });

    /* ___ Event on form ... */
    const onSubmit = async (data: OrganizationFormData) => {
        console.log("Data : ", data);
        const payload = {
            ...data,
            departments: departments,
        }
        const response = await axios.post("/api/organization/create", payload);
        router.push(response.data.redirect);
        window.localStorage.setItem("org-id", response.data.organization.id)
        // setdisabled(false)
    };

    const goNext1 = () => {
        setDisabled(true);
        /* ___ Checks all fields in form step 1 and proceed furthur ... */
        const values = getValues(["orgName", "industryType", "orgAddress"]);
        // console.log("Values : ", values);
        const allCleared = values.every((val) => val && val !== "")
        if (allCleared) {
            setStep(2);
            setDisabled(false);
        } else {
            setDisabled(false);
            alert("Please fill all organization info fields.");
        }
    };

    const goNext2 = () => {
        setDisabled(true);
        /* ___ Checks all fields in form step 2 and proceed furthur ... */
        const values = getValues(["orgEmail", "orgPassword", "orgPhone", "staffSize"]);
        // console.log("Values : ", values);
        const allCleared = values.every((val) => val && val !== "")

        if (allCleared) {
            setDisabled(false);
            setStep(3);
        } else {
            setDisabled(false);
            alert("Please fill all organization info fields.");
        }
    };

    /*  ______ For adding and deleting departments ...*/
    const addDepartments = () => {
        if (!departments.includes(department.toLowerCase()) && department !== "") {
            setdepartments([...departments, department.toLowerCase()])
        }
    }
    const deleteDepartment = (dept: string) => {
        const filtered = departments.filter((department) => department.toLowerCase() !== dept)
        setdepartments([...filtered]);
    }

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
                            {/* departments */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Departments</label>
                                <div className="flex flex-row flex-nowrap  gap-[10px]">
                                    <input
                                        type="text"
                                        onChange={(e) => {
                                            setdepartment(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key.toLowerCase() === "enter") {
                                                addDepartments()
                                                e.currentTarget.value = ""
                                            }
                                        }}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Example firm Pvt Ltd"
                                    />

                                    <button type="button" className="px-[10px] py-[5px] rounded-md bg-blue-600" onClick={addDepartments}>Add</button>

                                </div>
                                <br />
                                <div className="flex flex-row flex-wrap gap-[10px]">
                                    {departments.map((department, idx) => (<span className="border border-green-400 rounded-2xl px-1 text-sm text-white bg-green-400" key={idx}>{department}<X className="w-4 h-4" onClick={() => {
                                        deleteDepartment(department)
                                    }} /></span>))}

                                </div>
                                {departments.length <= 0 && <p className="text-red-400 text-sm">At least one department is required</p>}
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
                                onClick={goNext1}
                                className={`w-full ${disabled ? "bg-blue-700 cursor-not-allowed" : "bg-blue-600 cursor-pointer"} hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition`}>
                                Continue
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
                                    placeholder="abc@example.com"
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
                                <label className="block text-slate-700 font-medium mb-1">Staff size</label>
                                <input
                                    type="number"
                                    {...register("staffSize", {
                                        valueAsNumber: true,
                                    })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.staffSize && <p className="text-red-400 text-sm">{errors.staffSize.message}</p>}
                            </div>

                            <button
                                type="submit"
                                className={`${disabled ? "bg-green-700 cursor-not-allowed" : "bg-green-500 cursor-pointer"} w-full hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition`}
                                onClick={goNext2}
                            >
                                Go next
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            {/* userName*/}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Your name</label>
                                <input
                                    type="text"
                                    {...register("userName")}
                                    placeholder="abc"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.userName && <p className="text-red-400 text-sm">{errors.userName.message}</p>}
                            </div>

                            {/* userEmail */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">Your email</label>
                                <input
                                    type="email"
                                    {...register("userEmail")}
                                    placeholder="organization@example.com"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.userEmail && <p className="text-red-400 text-sm">{errors.userEmail.message}</p>}
                            </div>

                            {/* user Password */}
                            <div>
                                <label className="block text-slate-700 font-medium mb-1">User Password </label>
                                <input
                                    type="password"
                                    {...register("userPassword")}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.userPassword && <p className="text-red-400 text-sm">{errors.userPassword.message}</p>}
                            </div>

                            <p className="text-sm text-green-400">You're being added as manager of organization {getValues(["orgName"])[0]}</p>

                            <button
                                type="submit"
                                className={`${disabled ? "bg-green-700 cursor-not-allowed" : "bg-green-500 cursor-pointer"} w-full hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition`}                   >
                                Create organization
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrganizationForm;