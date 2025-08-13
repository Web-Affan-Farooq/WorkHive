/* ____ Type definitions ____ */
type PlanType = "FREE" | "TEAMS" | "PRO";

interface AccountInfo {
    name: string;
    email: string;
    password: string;
    plan: PlanType;
    customerId: string | null;
    subscriptionId: string | null;
}

type CreateAccountResponse = Promise<{
    message: string;
    status: number;
    redirect:"/dashboard" | null,
}>;

export type{
    PlanType,
    AccountInfo,
    CreateAccountResponse
}