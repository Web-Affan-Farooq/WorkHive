"use client";
/* ____ Hooks  ... */
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/stores/plan";

/* ____ Schemas  ... */
import { AccountSignupSchema } from "@/validations";

/* ____ Libraries  ... */
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";

/* ____ Components  ... */
import { CircleCheck, Crown } from 'lucide-react';
import { Footer, Header } from "@/components/layout";
import { PasswordInput } from "@/components/common";

/* ____ infers type from schema  ... */
type AccountSignupFormData = z.infer<typeof AccountSignupSchema>

const Signup = () => {
    /* ___ react hook form ... */
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountSignupFormData>({
        resolver: zodResolver(AccountSignupSchema),
        mode: "onChange",
    });
    /* ____ For controlling button  ... */
    const [disabled, setDisabled] = useState(false);

    /* ____ Getting plan from global state ... */
    const { plans, subscriptionPlan, setPlan } = usePlan();

    /* ____ Runs on form submission ... */
    const signup = async (data: AccountSignupFormData) => {
        console.log("Data ready .... :  ", data);
        /* ____ Disable the button ... */
        setDisabled(true);
        try {
            /* ____ collect data --> Make request --> show success fallback ... */
            const payload = {
                ...data,
                plan: subscriptionPlan,
                customerId: null,
                subscriptionId: null
            }
            if (payload.plan === "FREE") {
                const response = await axios.post("/api/accounts/create", payload);
                console.log(response.data);
                if (response.status === 201) {
                    toast.success(response.data.message);
                    router.push(response.data.redirect);
                }
            }
            else {
                const response = await axios.post("/api/payment/create", payload);
                console.log('payment api response : ', response.data);
                window.document.location.href = response.data.url;
            }
        } catch (err) {
            toast.error("An error occured")
            console.log(err);
        }
        /* ____ Initialize button ... */
        setDisabled(false)
    }
    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <article className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <section>
                        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>
                        <form onSubmit={handleSubmit(signup)} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    autoComplete="name"
                                    {...register("name")}
                                    placeholder="John Doe"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    {...register("email")}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                                    Password
                                </label>
                                <PasswordInput
                                    id="password"
                                    autoComplete="new-password"
                                    {...register("password")}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                )}
                            </div>

                            {/* select plan */}
                            <div>
                                <label className={`text-slate-700 font-medium mb-1`}>Select plan</label>
                                <div className="flex flex-col gap-[10px]">
                                    {
                                        plans.map((plan, idx) => (
                                            <div className={`border-3 py-2 px-5 rounded-lg cursor-pointer ${subscriptionPlan === plan.value ? "border-indigo-600" : "border-white"} `} onClick={() => setPlan(plan.value)} key={idx}>
                                                <h3 className="text-[16px] font-bold mb-1 flex flex-row flex-nowrap justify-between items-center ">
                                                    <span className="flex flex-row flex-nowrap gap-[10px]"><Crown className={`stroke-yellow-500 size-5 items-center ${plan.value !== "FREE" ? "" : "hidden"}`} />{plan.name}</span>
                                                    <span className="text-indigo-600">${plan.price}</span>
                                                </h3>
                                                <ul>
                                                    <li className={`flex flex-row  flex-nowrap items-center gap-[7px]`}>
                                                        <CircleCheck className="size-4 text-green-600" /> <p className="text-sm text-gray-500">{plan.organizations} organizations</p>
                                                    </li>
                                                    <li className={`flex flex-row flex-nowrap items-center gap-[7px]`}>
                                                        <CircleCheck className="size-4 text-green-600" /> <p className="text-sm text-gray-500">{plan.departments} departments</p>
                                                    </li>
                                                    <li className={`flex flex-row flex-nowrap items-center gap-[7px]`}>
                                                        <CircleCheck className="size-4 text-green-600" /> <p className="text-sm text-gray-500">{plan.employeesInEach} employees in each department</p>
                                                    </li>
                                                </ul>
                                            </div>))
                                    }
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={disabled}
                                className={`w-full py-2 text-white font-semibold rounded-lg transition ${disabled
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-black cursor-pointer"
                                    }`}
                            >
                                Create Account
                            </button>
                        </form>
                    </section>
                </article>
            </main>

            <Footer />
        </>
    )
}
export default Signup;
