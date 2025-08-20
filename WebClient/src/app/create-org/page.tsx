"use client";
/* ____ Hooks  ... */
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* ____ Libraries  ... */
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

/* ____ Components and validations  ... */
import { OrganizationFormSchema } from "@/validations";
import { PasswordInput } from "@/components/common";
import ShowClientError from "@/utils/Error";
import Notify from "@/utils/Notifications";

/* ____ Infered type from  OrganizationFormSchema  ... */
type OrganizationFormData = z.infer<typeof OrganizationFormSchema>;

const OrganizationForm = () => {
  /* ____ For redirecting logic ... */
  const router = useRouter();

  /* ____ For disabling button ... */
  const [disabled, setDisabled] = useState(false);

  /* ___ react hook form ... */
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(OrganizationFormSchema),
    mode: "onChange",
  });

  /* ___ For creating organization ... */
  const createOrganization = async (data: OrganizationFormData) => {
    setDisabled(true);
    try {
      const response = await axios.post("/api/organizations/create", data);
      if (response.status === 201) {
        Notify.success(response.data.message);
        router.push(response.data.redirect);
      }
    } catch (err) {
      ShowClientError(err, "Create organization error");
    }
    setDisabled(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md max-sm:w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Step 1 of 2
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit(createOrganization)}>
          <>
            {/* orgName */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Organization Name
              </label>
              <input
                type="text"
                {...register("organizationName")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Example firm Pvt Ltd"
              />
              {errors.organizationName && (
                <p className="text-red-400 text-sm">
                  {errors.organizationName.message}
                </p>
              )}
            </div>
            {/* orgEmail */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("organizationEmail")}
                placeholder="abc@example.com"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.organizationEmail && (
                <p className="text-red-400 text-sm">
                  {errors.organizationEmail.message}
                </p>
              )}
            </div>
            {/* orgPassword */}
            <div>
              <label
                htmlFor="password"
                className="block text-slate-700 font-medium mb-1"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("organizationPassword")}
              />
              <input />
              {/* ____ Show validation errors if any ... */}
              {errors.organizationPassword && (
                <p className="text-red-400 font-semibold text-sm">
                  {errors.organizationPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full ${disabled ? "bg-indigo-700 cursor-not-allowed" : "bg-indigo-600 cursor-pointer"} hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition`}
            >
              Continue
            </button>
          </>
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;
