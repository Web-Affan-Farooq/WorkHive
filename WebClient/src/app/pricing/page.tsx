"use client";
import React from "react";

/* ____ Components and icons ... */
import { CircleCheck } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import Link from "next/link";
import { useSignupFormData } from "@/stores/plan";

/* ____ Interface for plan object ... */
interface Plan {
    name: string;
    value: "FREE" | "TEAMS" | "PRO";
    organizations: number;
    departments: number;
    employeesInEach: number;
    price: number;
}

const PricingSection = () => {
    const { plans, subscriptionPlan, setPlan } = useSignupFormData();
    return (
        <main>
            <article>
                <Header />
                <div className="mt-20 sm:mt-28 md:mt-32"></div>

                <section className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-16">
                    <div className="max-w-7xl mx-auto text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">Pricing for organizations</h2>
                        <p className="text-gray-400 mt-4">
                            Choose the right plan that fits your organization.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                        {plans.map((plan: Plan, idx) => (
                            <div
                                key={idx}
                                onClick={() => setPlan(plan.value)}
                                className="border rounded-2xl shadow-lg p-6 sm:p-8 bg-white flex flex-col justify-between transition-transform duration-300 hover:scale-[1.02]"
                            >
                                <div className={`p-6 border-2 rounded-lg cursor-pointer ${subscriptionPlan === plan.value ? "border-indigo-600" : "border-transparent"}`}>
                                    <p className="text-center text-3xl font-bold text-indigo-600 mb-4">
                                        ${plan.price}
                                    </p>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center sm:text-left">
                                        {plan.name}
                                    </h3>
                                    <ul className="text-left space-y-2 text-gray-700">
                                        <li className="text-gray-500 text-sm flex items-center gap-1">
                                            <CircleCheck className="size-4 text-green-500" />
                                            {plan.organizations} organizations
                                        </li>
                                        <li className="text-gray-500 text-sm flex items-center gap-1">
                                            <CircleCheck className="size-4 text-green-500" />
                                            {plan.departments} Departments
                                        </li>
                                        <li className="text-gray-500 text-sm flex items-center gap-1">
                                            <CircleCheck className="size-4 text-green-500" />
                                            {plan.employeesInEach} Employees per department
                                        </li>
                                        <li className="text-gray-500 text-sm flex items-center gap-1">
                                            <CircleCheck className="size-4 text-green-500" />
                                            {plan.employeesInEach * plan.departments} total staff in each orgnanization
                                        </li>
                                    </ul>
                                </div>
                                <Link
                                    href="/signup"
                                    onClick={() => setPlan(plan.value)}
                                    className="cursor-pointer mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition duration-200 text-center"
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="mb-20 sm:mb-28 md:mb-32"></div>
                <Footer />
            </article>
        </main>

    );
};

export default PricingSection;