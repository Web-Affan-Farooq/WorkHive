import db from "@/db";
import { user } from "@/db/schemas";
import { eq } from "drizzle-orm";

class GetAccountInfo {
  accountId: string;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  getAccountInfo = async () => {
    const account = await db.query.user.findFirst({
      where: eq(user.id, this.accountId),
      columns: {
        createdAt: false,
        updatedAt: false,
        stripeCustomerId: false,
        stripeSubId: false,
        password: false,
      },
      with: {
        notifications: true,
        departments: {
          with: {
            department: true, // if you’re using junction table
          },
        },
      },
    });

    if (!account) return null;

    // flatten the department list if needed
    const departments = account.departments?.map((d) => d.department) ?? [];

    return {
      info: {
        id: account.id,
        name: account.name,
        email: account.email,
      },
      notifications: account.notifications,
      departments,
    };
  };
}

export default GetAccountInfo;
