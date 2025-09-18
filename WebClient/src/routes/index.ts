export { default as ChangePassword } from "../actions/accounts/ChangePasswordAction";
export { default as CreateAccount } from "./CreateAccount";
export { default as DeleteAccount } from "../actions/accounts/DeleteAccount";
export { default as Login } from "../actions/accounts/Login";
export { default as UpdateProfile } from "../actions/accounts/UpdateProfileAction";

export { default as DashboardData } from "../actions/dashboard";
export { default as CreateDepartment } from "../actions/departments/CreateDepartment";
export { default as DeleteDepartment } from "../actions/departments/DeleteDepartment";
export { default as JoinDepartment } from "../actions/departments/JoinDepartmentAction";
export { default as UnjoinDepartment } from "../actions/departments/UnjoinDepartmentAction";

export { default as DeleteNotification } from "../actions/notifications/DeleteNotification";

export { default as CreateOrganization } from "../actions/organizations/CreateOrganization";
export { default as DeleteOrganization } from "../actions/organizations/DeleteOrganization";
export { default as VerifyOrganization } from "../actions/organizations/VerifyOrganization";

export { default as CreateTask } from "../actions/tasks/CreateTasks";
export { default as DeleteTask } from "../actions/tasks/DeleteTask";
export { default as MarkAsDone } from "../actions/tasks/MarkDone";

export {default as AddComment} from './AddComment'
export {default as DeleteComment} from '../actions/accounts/DeleteAccount'

import { PlanType } from "@/@types/types";
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
