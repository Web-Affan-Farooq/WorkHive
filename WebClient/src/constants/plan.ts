/* ____ Interface for plan  ... */
interface PlanSelection {
    name: string;
    value: "FREE" | "TEAMS" | "PRO";
    organizations: number;
    departments: number;
    employeesInEach: number;
    price: number;
}

/* ____ plans  ... */
const plans: PlanSelection[] = [
    {
        name: "Free",
        value: "FREE",
        organizations: 1,
        departments: 5,
        employeesInEach: 7,
        price: 0,
    },
    {
        name: "Teams",
        value: "TEAMS",
        organizations: 5,
        departments: 7,
        employeesInEach: 15,
        price: 200,
    },
    {
        name: "Pro",
        value: "PRO",
        organizations: 7,
        departments: 10,
        employeesInEach: 30,
        price: 350
    },
]

export default plans;