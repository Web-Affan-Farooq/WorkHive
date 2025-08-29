import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import db from "@/db";
import { departments } from "@/schemas";
import { InferInsertModel } from "drizzle-orm";

type CreateDepartmentRequest = {
  name: string;
  organizationId: string;
};
type CreateDepartmentResponse = {
  message: "department created successfully";
  department: {
    name: string;
    id: string;
    organizationId: string;
  } | null;
};
export type { CreateDepartmentRequest, CreateDepartmentResponse };

const CreateDepartment = async (req: NextRequest) => {
  const body: CreateDepartmentRequest = await req.json();

  try {
    const department: InferInsertModel<typeof departments> = {
      name: body.name,
      organizationId: body.organizationId,
    };
    const [newDepartment] = await db
      .insert(departments)
      .values(department)
      .returning();

    return NextResponse.json(
      {
        message: "department created successfully",
        department: newDepartment,
      },
      {
        status: 201,
      }
    );
  } catch (err) {
    console.log("Error : ", err);
    return NextResponse.json(
      {
        message: "An error occured",
        department: null,
      },
      {
        status: 500,
      }
    );
  }
};
export default CreateDepartment;
