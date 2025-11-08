"use client";
// ____ Hooks  ...
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { usePlan } from "@/stores/plan";

// ____ Schemas and types  ...
import { AccountSignupSchema } from "@/validations";

// ____ Libraries  ...
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ____ Components  ...
import { Footer, Header } from "@/components/layout";
import { PasswordInput } from "@/components/common";

// ____ Utils ...
import Notify from "@/utils/Notifications";

// ____ Server actions ...
import { CreateAccountAction } from "@/actions/accounts";
import { toast } from "sonner";

// ____ infers type from schema  ...
type SignupFormData = z.infer<typeof AccountSignupSchema>;

const Signup = () => {
  /* ___ react hook form ... */
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(AccountSignupSchema),
    mode: "onChange",
  });

  /* ____ Getting plan from global state ... */
  const { subscriptionPlan } = usePlan();

  /* ____ Runs on form submission ... */
  const signup = async (formData: SignupFormData) => {
    /* ____ collect data --> Make request --> show success fallback ... */
    const { message, success, redirect } = await CreateAccountAction({
      ...formData,
      plan: subscriptionPlan,
    });
    if (!success) {
      toast.error(message);
    }
    if (redirect) {
      Notify.success(message);
      router.push(redirect);
    }
  };
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <article className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <section>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Create Account
            </h2>
            <form onSubmit={handleSubmit(signup)} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                disabled={isSubmitting}
                className={`w-full py-2 text-white font-semibold rounded-lg transition ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-black cursor-pointer"
                }`}
              >
                Create Account
              </button>
            </form>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
};
export default Signup;
