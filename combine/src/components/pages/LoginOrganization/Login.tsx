"use client"
import {OrganizationLoginSchema} from "../../../validations";
import * as z from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

type LoginFormData = z.infer<typeof OrganizationLoginSchema>

export default function Login() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>(
    {
      resolver: zodResolver(OrganizationLoginSchema)
    }
  )

  const formSubmission = async (data:LoginFormData) => {
    const updatedData = {
      email:data.organizationEmail,
      password:data.orgPassword
    }
    try {
      const response = await axios.post("/api/login-org",updatedData)
      router.push(response.data.redirect)
      window.localStorage.setItem("ID",response.data.id)
    } catch (err) {
      alert("An error occured")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md max-sm:w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Login To Your Organization
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit(formSubmission)}>
          {/* Full Name */}

          <div>
            <label htmlFor="email" className="block text-slate-700 font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="employee@company.com"
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
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
