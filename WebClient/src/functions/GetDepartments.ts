import { department } from "@/db/schemas";
import { eq } from "drizzle-orm";
import db from "@/db";

const getDepartmentsOfOrganization = async (organizationId: string) => {
  const departmentsOfRequiredOrg = await db.query.department.findMany({
    where: eq(department.organizationId, organizationId),
  });
  return departmentsOfRequiredOrg;
};

export default getDepartmentsOfOrganization;
