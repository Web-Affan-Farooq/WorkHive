// import Logger from "@/lib/logger";
import getDepartmentsOfOrganization from "./GetDepartments";
import { userDepartmentsJunction, user } from "@/db/schemas";
import { inArray, eq } from "drizzle-orm";
import db from "@/db";
import { Department } from "@/@types/types";

// const logger = new Logger("GetJoinedOrganizationuser.ts");

const getOrganizationUsersList = async (organizationId: string) => {
  // logger.log(102, "Running getJoinedOrganizationuser() : ", "-------------");

  const userProfilesArray: { name: string; email: string }[] = [];
  const departmentsIds = (
    await getDepartmentsOfOrganization(organizationId)
  ).map((dept: Department) => dept.id);

  const userIdsinJunction = await db
    .select()
    .from(userDepartmentsJunction)
    .where(inArray(userDepartmentsJunction.departmentId, departmentsIds));
  // logger.log(76, "Selected junctions : ", userProfilesArray);

  await Promise.all(
    userIdsinJunction.map(async (junction) => {
      const [requiredUser] = await db
        .select({ name: user.name, email: user.email })
        .from(user)
        .where(eq(user.id, junction.userId));
      userProfilesArray.push(requiredUser);
      // logger.log(84, "pushed new user to list : ", userProfilesArray);
    })
  );

  // logger.log(88, "Reurning user profiles: ", userProfilesArray);
  return userProfilesArray;
};
export default getOrganizationUsersList;
