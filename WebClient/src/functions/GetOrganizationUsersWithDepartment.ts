import { userDepartmentsJunction, user } from "@/db/schemas";
import { inArray, eq } from "drizzle-orm";
import db from "@/db";


const getOwnedOrganizationuser = async (departmentsIds: string[]) => {
  /* This function will return an object with department id corresponding to array of user profiles  */
  const userObject: Record<string, { name: string; email: string }[]> = {};

  departmentsIds.forEach((deptId) => (userObject[deptId] = []));
  
  const userIdsinJunction = await db
    .select()
    .from(userDepartmentsJunction)
    .where(inArray(userDepartmentsJunction.departmentId, departmentsIds));
  
  await Promise.all(
    userIdsinJunction.map(async (junction) => {
      const [requiredUser] = await db
        .select({ id: user.id, name: user.name, email: user.email })
        .from(user)
        .where(eq(user.id, junction.userId));
      userObject[junction.departmentId].push(requiredUser);
    })
  );
  return userObject;
};
export default getOwnedOrganizationuser;
