import { AxiosError } from "axios";
import Notify from "../Notifications";

const ShowClientError = (err: unknown, type: string) => {
  const error = err as AxiosError<{ message?: string }>; // 👈 strongly type error.response.data

  if (error.response) {
    // Server responded with a status outside 2xx
    //
    Notify.error(error.response.data?.message || "Something went wrong!");
  } else if (error.request) {
    // Request made but no response received
    Notify.error("No response from server. Please try again.");
  } else {
    // Something went wrong while setting up the request
    Notify.error(error.message || "Unexpected error occurred.");
  }

  console.error(`${type} : `, error);
};
export default ShowClientError;
