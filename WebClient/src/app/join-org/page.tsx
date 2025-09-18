"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Departments } from "@/@types/modeltypes";
import { z } from "zod";
import Notify from "@/utils/Notifications";
import ShowClientError from "@/utils/Error";
import type {
  JoinDepartmentRequest,
  JoinDepartmentResponse,
} from "@/actions/departments/JoinDepartmentAction";

const OrganizationForm = () => {
  const router = useRouter();

  // Step control
  const [step, setStep] = useState(1);
  const [disabled, setDisabled] = useState(false);

  // Data states
  const [departments, setDepartments] = useState<Departments[]>([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);
  const [organizationId, setOrganizationId] = useState("");

  // UUID validation schema
  const idValidationSchema = z.uuid();

  // Verify organization and fetch departments
  const verifyOrganization = useCallback(async (orgId: string) => {
    try {
      const res = await axios.post("/api/organizations/verify", { id: orgId });
      if (res.data.departments?.length > 0) {
        setDepartments(res.data.departments);
        return true;
      } else {
        Notify.error("No departments found for this organization.");
        return false;
      }
    } catch (err) {
      ShowClientError(err, "Organization not found");
      return false;
    }
  }, []);

  // Step 1 → Step 2
  const goNext = async () => {
    setDisabled(true);
    try {
      idValidationSchema.parse(organizationId); // validate UUID
      const isValid = await verifyOrganization(organizationId);
      if (isValid) {
        setStep(2);
      }
    } catch {
      Notify.error("Invalid Organization ID");
    }
    setDisabled(false);
  };

  // Final submit (Join Department)
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartmentId) {
      Notify.error("Please select a department");
      return;
    }
    setDisabled(true);
    try {
      const payload: JoinDepartmentRequest = {
        selectedDepartmentId,
      };
      const response = await axios.post("/api/departments/join", payload);
      const { data }: { data: JoinDepartmentResponse } = response;
      Notify.success(data.message);
      router.push(data.redirect);
    } catch (err) {
      ShowClientError(err, "Organization joining error");
    }
    setDisabled(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Step {step} of 2
        </h2>

        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Step 1: Organization ID */}
          {step === 1 && (
            <>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Organization ID
                </label>
                <input
                  type="text"
                  value={organizationId}
                  onChange={(e) => setOrganizationId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter organization ID"
                  disabled={disabled}
                />
              </div>
              <p className="text-sm text-green-500">
                This ID can be provided by your organization admin
              </p>
              <button
                type="button"
                onClick={goNext}
                disabled={disabled}
                className={`w-full text-white font-semibold py-2 rounded-lg transition ${
                  disabled
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Verify
              </button>
            </>
          )}

          {/* Step 2: Select Department */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Select Department
                </label>
                <select
                  value={selectedDepartmentId || ""}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={disabled}
                >
                  <option value="">-- Select a department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={disabled}
                className={`w-full text-white font-semibold py-2 rounded-lg transition ${
                  disabled
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                Join Organization
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrganizationForm;
