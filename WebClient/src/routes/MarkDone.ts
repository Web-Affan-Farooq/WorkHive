// _____ /api/tasks/mark-done ...
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import GetTokenPayload from "@/utils/GetTokenPayload";
import db from "@/db";
import { eq, InferInsertModel } from "drizzle-orm";
import { notifications, organizations, tasks } from "@/schemas";

type MarkDoneRequest = {
  taskId: string;
  note: string;
  name: string;
  departmentName: string;
  organizationName: string;
};
type MarkAsDoneResponse = {
  message: string;
};
export type { MarkAsDoneResponse, MarkDoneRequest };

const MarkAsDone = async (req: NextRequest) => {
  const body: MarkDoneRequest = await req.json();
  const payload = await GetTokenPayload();
  if (!payload) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 402,
      }
    );
  }

  try {
    const [completedTask] = await db
      .update(tasks)
      .set({
        completed: true,
        completedOn: new Date(),
        note: body.note,
      })
      .returning();
    const [requiredOrganization] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, completedTask.organizationId));

    const dueDate = new Date(completedTask.dueDate);

    if (completedTask.completedOn && dueDate < completedTask.completedOn) {
      const newNotification: InferInsertModel<typeof notifications> = {
        title: "Late task submission ",
        message: `late task submission from ${body.name} belongs to ${body.departmentName} department of ${body.organizationName}`,
        type: "SUCCESS",
        userId: requiredOrganization.userId,
      };
      await db.insert(notifications).values(newNotification);
    } else {
      const newNotification: InferInsertModel<typeof notifications> = {
        title: "New task submission ",
        message: `${body.name} has completed the given task , now waiting for review . Check ${body.departmentName} department of ${requiredOrganization.name}`,
        type: "SUCCESS",
        userId: payload.accountId,
      };
      await db.insert(notifications).values(newNotification);
    }
    return NextResponse.json(
      {
        message: "Marked as done",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "An error occured",
      },
      {
        status: 500,
      }
    );
  }
};
export default MarkAsDone;
