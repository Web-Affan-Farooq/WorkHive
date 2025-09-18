"use client";
// ____ Hooks ...
import React, { useState } from "react";
import { useForm } from "react-hook-form";
// ____ Components ...
import { PasswordInput } from "@/components/common";
// ____ Utils ...
import ShowClientError from "@/utils/Error";
import Notify from "@/utils/Notifications";
// ____ Libraries ...
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
// ____ Types ...
import { ChangePasswordSchema } from "@/validations";
import {
  ChangePasswordAPIResponse,
  ChangePasswordAPIRequest,
} from "@/actions/accounts/ChangePasswordAction";

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

const ChangePassword = () => {
  const [disabled, setDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const handleChangePassword = async (FormData: ChangePasswordFormData) => {
    setDisabled(true);
    try {
      const payload: ChangePasswordAPIRequest = {
        newPassword: FormData.password,
      };
      const { data }: { data: ChangePasswordAPIResponse } = await axios.put(
        "/api/accounts/change-password",
        payload
      );
      Notify.success(data.message);
    } catch (err) {
      ShowClientError(err, "Change password error");
    }
    setDisabled(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Change Password
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit(handleChangePassword)}>
        <label htmlFor="enter your new password">
          <PasswordInput
            className="w-full rounded px-4 py-2"
            placeholder="New Password"
            {...register("password")}
          />
        </label>
        {errors.password && <p>{errors.password.message}</p>}
        <br />
        <button
          type="submit"
          className={`${disabled ? "bg-green-700 cursor-not-allowed" : "bg-green-500 cursor-pointer"} text-white px-4 py-2 rounded-lg hover:bg-green-700`}
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
