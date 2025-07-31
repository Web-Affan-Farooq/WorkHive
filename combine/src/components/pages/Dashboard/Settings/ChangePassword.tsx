"use client"
import React from 'react'
import {ChangePasswordSchema} from "@/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";

type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

const ChangePassword = () => {
    const {register, handleSubmit ,formState:{errors} } = useForm<ChangePasswordFormData>({
        resolver:zodResolver(ChangePasswordSchema),
        mode:"onChange",
    });

    const handleChangePassword = async (data:ChangePasswordFormData) => {
        console.log(data);
        // try {
        //     await axios.put("/api/users/change-password",{
        //         data:{
        //             password:
        //         }
        //     });
        //     toast.success("Password changed");
        // } catch (error) {
        //     toast.error("Failed to change password");
        // }
    };

  return (
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Change Password</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(handleChangePassword)}>
                        <input
                            type="password"
                            className="w-full border rounded px-4 py-2"
                            placeholder="New Password"
                            {...register("newPassword")}
                        />
                        {errors.newPassword && <p>{errors.newPassword.message}</p>}
                        <button
                        type='submit'
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Change Password
                        </button>
                    </form>
                </div>
  )
}

export default ChangePassword
