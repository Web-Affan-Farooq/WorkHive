import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { departments } from "@/schemas";
import { eq } from "drizzle-orm";

type DeleteDepartmentRequest = {
  id: string;
};
type DeleteDepartmentResponse = {
  id: string;
};
export type { DeleteDepartmentRequest, DeleteDepartmentResponse };

const DeleteDepartment = async (req: NextRequest) => {
  const { id } = await req.json();
  try {
    await db.delete(departments).where(eq(departments.id, id));
    return NextResponse.json(
      {
        message: "Department deleted successfully",
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log("Error : ", err);
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
export default DeleteDepartment;
