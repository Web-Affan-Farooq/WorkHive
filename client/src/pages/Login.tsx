import { departments } from "../constants/departments";
import LoginSchema from "../validations/LoginSchema";
import * as z from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

type LoginFormData = z.infer<typeof LoginSchema>

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>(
    {
      resolver: zodResolver(LoginSchema)
    }
  )

  const formSubmission = async (data:LoginFormData) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login",data)
      console.log(await response.data);
    } catch (err) {
      alert("An error occured")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md max-sm:w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Employee Management System
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit(formSubmission)}>
          {/* Full Name */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Employee id</label>
            <input
              type="number"
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("employeeId", { valueAsNumber: true })}
            />
            {errors.employeeId && <p className="text-red-400 font-semibold text-sm">{errors.employeeId.message}</p>}
          </div>

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
              {...register("employeeEmail")}
            />
            {errors.employeeEmail && <p className="text-red-400 font-semibold text-sm">{errors.employeeEmail.message}</p>}
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
              {...register("employeePassword")}
            />
            {errors.employeePassword && <p className="text-red-400 font-semibold text-sm">{errors.employeePassword.message}</p>}
          </div>
          {/* Department */}
          <div>
            <label className="block text-slate-700 font-medium mb-1">Department</label>
            {errors.employeeDepartment && <p className="text-red-400 font-semibold text-sm">{errors.employeeDepartment.message}</p>}
            <select
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register("employeeDepartment")}
            >
              {departments.map((dept: string, idx: number) => {
                return <option value={dept} key={idx}>{dept}</option>
              })}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
