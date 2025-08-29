/* ____ Type definitions ____ */

type CreateAccountResponse = Promise<{
  message: string;
  status: number;
  redirect: "/dashboard" | null;
}>;

export type { PlanType, AccountInfo, CreateAccountResponse };
