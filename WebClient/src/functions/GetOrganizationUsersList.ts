// import Logger from "@/lib/logger";
import { GetDepartments } from ".";
import { userDepartmentsJunction, users } from "@/schemas";
import { inArray, eq } from "drizzle-orm";
import db from "@/db";

// const logger = new Logger("GetJoinedOrganizationUsers.ts");

const getOrganizationUsersList = async (organizationId: string) => {
  // logger.log(102, "Running getJoinedOrganizationUsers() : ", "-------------");

  const userProfilesArray: { name: string; email: string }[] = [];
  const departmentsIds = (await GetDepartments(organizationId)).map(
    (dept) => dept.id
  );

  const userIdsinJunction = await db
    .select()
    .from(userDepartmentsJunction)
    .where(inArray(userDepartmentsJunction.departmentId, departmentsIds));
  // logger.log(76, "Selected junctions : ", userProfilesArray);

  await Promise.all(
    userIdsinJunction.map(async (junction) => {
      const [requiredUser] = await db
        .select({ name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, junction.userId));
      userProfilesArray.push(requiredUser);
      // logger.log(84, "pushed new user to list : ", userProfilesArray);
    })
  );

  // logger.log(88, "Reurning users profiles: ", userProfilesArray);
  return userProfilesArray;
};
export default getOrganizationUsersList;
