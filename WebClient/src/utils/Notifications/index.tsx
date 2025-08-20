import toast from "react-hot-toast";
import { Notification } from "@/components/common";

const Notify = {
  success: (msg: string) =>
    toast.custom(() => <Notification text={msg} type="success" />),
  error: (msg: string) =>
    toast.custom(() => <Notification text={msg} type="error" />),
};
export default Notify;
