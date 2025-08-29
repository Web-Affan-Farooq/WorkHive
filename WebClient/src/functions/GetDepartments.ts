import Logger from "@/lib/logger";
import { departments } from "@/schemas";
import { eq } from "drizzle-orm";
import db from "@/db";

const logger = new Logger("getDepartments.ts");
const getDepartmentsOfOrganization = async (organizationId: string) => {
  logger.log(92, "Running getDepartmentsOfOrganization : ", "---------------");
  const departmentsOfRequiredOrg = await db.query.departments.findMany({
    where: eq(departments.organizationId, organizationId),
  });
  logger.log(95, "returning departments  : ", departmentsOfRequiredOrg);
  return departmentsOfRequiredOrg;
};

export default getDepartmentsOfOrganization;
