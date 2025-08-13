import z from "zod";

const DepartmentSchema = z.object({
    name:z.string("Invalid name").min(4,"Atleast 4 characters are required").max(20,"Maximum 20 characters allowed"),
    organizationId:z.uuid()
}).strict();

export default DepartmentSchema