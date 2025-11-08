import db from "@/db"
import { userDepartmentsJunction , organization , user  } from "@/db/schemas";
import { eq , inArray } from "drizzle-orm";
import { Department } from "@/@types/types";

const logger = new Logger("GetOwnedOrganization.ts")

const getOrganizationUsersList = async (organizationId: string) => {
  logger.log(102, "Running getJoinedOrganizationuser() : ", "-------------");

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


const getJoinedOrganizations = async (accountId:string) => {

  // ______ Fetch all the departmet junctions related to user ...
    const userJoinedDepartments = await db.query.userDepartmentsJunction.findMany(
    {
      where: eq(userDepartmentsJunction.userId, accountId),
      with: {
        department: true,
      },
    }
  );

  const orgIds: string[] = userJoinedDepartments.map((dept) => {
    return dept.department.organizationId;
  });


  const joinedOrganizations = await Promise.all(
    orgIds.map(async (orgId) => {
      const requiredJoinedOrganization = await db.query.organization.findFirst({
        where: eq(organization.id, orgId),
        columns: {
          name: true,
          organizationEmail: true,
        },
      });

      const department = userJoinedDepartments.find((dept) => {
        return (
          dept.userId === accountId && dept.department.organizationId === orgId
        );
      })!;

      // ____ returns an array of all users in the joined organization ..
      const allUsers = await GetOrganizationUsersList(orgId);

      // ____ returns array of all the tasks that are assigned to you  ..
      const allAssignedTasks = await GetJoinedOrganizationTasks(
        accountId,
        orgId
      );

      return {
        id: orgId,
        name: requiredJoinedOrganization?.name,
        email: requiredJoinedOrganization?.organizationEmail,
        department: department.department,
        users: allUsers,
        tasks: allAssignedTasks,
      };
    })
  );
   return joinedOrganizations;
}

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

// const logger = new Logger("GetJoinedOrganizationuser.ts");


export {
    getJoinedOrganizations
}