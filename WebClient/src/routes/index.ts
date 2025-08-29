export { default as ChangePassword } from "./ChangePassword";
export { default as CreateAccount } from "./CreateAccount";
export { default as DeleteAccount } from "./DeleteAccount";
export { default as Login } from "./Login";
export { default as UpdateProfile } from "./Update";

export { default as DashboardData } from "./Dashboard";
export { default as CreateDepartment } from "./CreateDepartment";
export { default as DeleteDepartment } from "./DeleteDepartment";
export { default as JoinDepartment } from "./JoinDepartment";
export { default as UnjoinDepartment } from "./UnjoinDepartment";

export { default as DeleteNotification } from "./DeleteNotification";

export { default as CreateOrganization } from "./CreateOrganization";
export { default as DeleteOrganization } from "./DeleteOrganization";
export { default as VerifyOrganization } from "./VerifyOrganization";

export { default as CreateTask } from "./CreateTasks";
export { default as DeleteTask } from "./DeleteTask";
export { default as MarkAsDone } from "./MarkDone";

// ____ type of logout api response
export type LogoutResponse = {
  message: string;
};

/* ____ payment response type ... */
type PaymentRequest = {
  name: string;
  email: string;
  password: string;
  plan: PlanType;
};
type PaymentResponse = {
  message: string;
  url: string;
};

export type { PaymentRequest, PaymentResponse };
