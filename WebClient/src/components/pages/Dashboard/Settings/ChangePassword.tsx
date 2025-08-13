"use client"
import React, { useState } from 'react'
import { ChangePasswordSchema } from "@/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { PasswordInput } from '@/components/common';
import Logger from '@/lib/logger';

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

const logger = new Logger('/dashboard/settings');

const ChangePassword = () => {
    const [disabled, setDisabled] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(ChangePasswordSchema),
        mode: "onChange",
    });

    const handleChangePassword = async (data: ChangePasswordFormData) => {
        setDisabled(true);
        try {
            const payload = {
                newPassword: data.password,
            }
            logger.log(31, "changed password : ", payload);
            const response = await axios.put("/api/accounts/change-password", payload);
            if (response.status !== 200) {
                toast.error(response.data.message);
            }
            toast.success(response.data.message);
        } catch (err) {
            toast.error("Failed to change password");
            console.log(err);
        }
        setDisabled(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Change Password</h2>
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
                    type='submit'
                    className={`${disabled ? "bg-green-700 cursor-not-allowed" : "bg-green-500 cursor-pointer"} text-white px-4 py-2 rounded-lg hover:bg-green-700`}>
                    Change Password
                </button>
            </form>
        </div>
    )
}

export default ChangePassword
