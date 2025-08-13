import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import plans from "@/constants/plan";

/* ____ Interface for plan  ... */
interface PlanSelection {
    name: string;
    value: "FREE" | "TEAMS" | "PRO";
    organizations: number;
    departments: number;
    employeesInEach: number;
    price: number;
}

interface Plan {
    plans: PlanSelection[]
    subscriptionPlan: "FREE" | "TEAMS" | "PRO",
    setPlan: (plan: "FREE" | "TEAMS" | "PRO") => void;
}

export const usePlan= create<Plan>()((
    persist(
        (set) => (
            {
                /* ____ For controlling plan  ... */
                subscriptionPlan: "FREE",
                setPlan: (plan: "FREE" | "TEAMS" | "PRO") => set(() => (
                    {
                        subscriptionPlan: plan,
                    }
                )),
                plans: plans
            }
        )
        ,
        {
            name: 'signup-form-data',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
))