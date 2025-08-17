import { create } from "zustand";
import * as z from "zod";
import { OrganizationFormSchema } from "@/validations";

interface OrganizationData extends z.infer<typeof OrganizationFormSchema> {
  organizationPassword: string;
}

interface OrganizationFormDataState {
  organization: OrganizationData;
  setOrganizationFormData: (data: OrganizationData) => void;
}

export const useOrganizationFormData = create<OrganizationFormDataState>()(
  (set) => ({
    organization: {
      organizationName: "",
      organizationEmail: "",
      organizationPassword: "",
    },

    setOrganizationFormData: (data: OrganizationData) =>
      set(() => ({
        organization: data,
      })),
  })
);
