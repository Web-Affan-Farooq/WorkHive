"use client"
import { OrganizationLoginSchema } from "../../../validations";
import * as z from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

type LoginFormData = z.infer<typeof OrganizationLoginSchema>

export default function Login() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>(
    {
      resolver: zodResolver(OrganizationLoginSchema)
    }
  );
  const [disabled, setdisabled] = useState(false);

  const formSubmission = async (data: LoginFormData) => {
    setdisabled(true);
    try {
      const response = await axios.post("/api/organization/login", data)
      console.log(response.data);
      if (!response.data.success) {
        toast.error(response.data.message);
        setdisabled(false)
      }
      window.localStorage.setItem("org-ID", response.data.organizationId);
      window.localStorage.setItem("user-ID", response.data.userId);
      toast.success(response.data.message);
      router.push(response.data.redirect);
      setdisabled(false);
    } catch (err) {
       toast.error("An error occured");
      console.log(err);
      setdisabled(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md max-sm:w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Login To Your Organization
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit(formSubmission)}>
          {/* User email */}
          <div>
            <label htmlFor="email" className="block text-slate-700 font-medium mb-1">
              Your email
            </label>
            <input
              id="user-email"
              type="email"
              placeholder="abc@company.com"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("managerEmail")}
            />
            {errors.managerEmail && <p className="text-red-400 font-semibold text-sm">{errors.managerEmail.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-slate-700 font-medium mb-1">
              Organization email
            </label>
            <input
              id="org-email"
              type="email"
              placeholder="abc@gmail.com"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("organizationEmail")}
            />
            {errors.organizationEmail && <p className="text-red-400 font-semibold text-sm">{errors.organizationEmail.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("orgPassword")}
            />
            {errors.orgPassword && <p className="text-red-400 font-semibold text-sm">{errors.orgPassword.message}</p>}
          </div>

          <button
            type="submit"
            className={`w-full ${disabled ? "bg-blue-700 cursor-not-allowed" : "bg-blue-600 cursor-pointer"} hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition`}>
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
