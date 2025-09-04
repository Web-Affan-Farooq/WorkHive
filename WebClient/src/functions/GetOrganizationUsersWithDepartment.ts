// import Logger from "@/lib/logger";
import { userDepartmentsJunction, users } from "@/schemas";
import { inArray, eq } from "drizzle-orm";
import db from "@/db";

// const logger = new Logger("/GetOwnedOrganizationUsers.ts");

const getOwnedOrganizationUsers = async (departmentsIds: string[]) => {
  /* This function will return an object with department id corresponding to array of user profiles  */
  // logger.log(64, "Running getOwnedOrganizationUsers() : ", "-------------");

  const usersObject: Record<string, { name: string; email: string }[]> = {};

  departmentsIds.forEach((deptId) => (usersObject[deptId] = []));
  // logger.log(69, "Created users map : ", usersObject);

  const userIdsinJunction = await db
    .select()
    .from(userDepartmentsJunction)
    .where(inArray(userDepartmentsJunction.departmentId, departmentsIds));
  // logger.log(76, "Selected junctions : ", usersObject);

  await Promise.all(
    userIdsinJunction.map(async (junction) => {
      const [requiredUser] = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, junction.userId));
      usersObject[junction.departmentId].push(requiredUser);
      // logger.log(84, "pushed new user to map : ", usersObject);
    })
  );

  // logger.log(88, "Reurning users : ", usersObject);
  return usersObject;
};
export default getOwnedOrganizationUsers;
