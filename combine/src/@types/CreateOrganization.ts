import * as z from "zod";
import { OrganizationSchema } from "@/validations";

// Infer the original type
type Original = z.infer<typeof OrganizationSchema>;

// Replace `staffSize` with a custom type
type ModifiedOrganization = Omit<Original, "staffSize"> & {
  staffSize: {
    employees: number;
    managers: number;
  };
};

export type {
  ModifiedOrganization as Organization
};
