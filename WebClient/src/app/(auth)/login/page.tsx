"use client";
// ___ Hooks ...
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ___ Components...
import { Footer, Header } from "@/components/layout";
import { PasswordInput } from "@/components/common";

// ___ Libs...
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ___ Types and schemas...
import { AccountLoginSchema } from "@/validations";
import LoginAction from "@/actions/accounts/Login";

// ___ Utils...
import ShowClientError from "@/utils/Error";
import Notify from "@/utils/Notifications";

type AccountLoginFormData = z.infer<typeof AccountLoginSchema>;

const Login = () => {
  const router = useRouter();
  /* ___ react hook form ... */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountLoginFormData>({
    resolver: zodResolver(AccountLoginSchema),
    mode: "onChange",
  });
  const [disabled, setDisabled] = useState(false);

  // ____ Runs on form submission ...
  const login = async (FormData: AccountLoginFormData) => {
    try {
      const { message, success, redirect } = await LoginAction(
        FormData.email,
        FormData.password
      );
      if (!success) {
        Notify.error(message);
      }
      Notify.success(message);
      router.push(redirect ? redirect : "/");
    } catch (err) {
      ShowClientError(err, "Login error");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <article className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <section>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Log in
            </h2>
            <form onSubmit={handleSubmit(login)} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Password
                </label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={disabled}
                className={`w-full py-2 text-white font-semibold rounded-lg transition ${
                  disabled
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-black cursor-pointer"
                }`}
              >
                Log in
              </button>
            </form>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
};
export default Login;
