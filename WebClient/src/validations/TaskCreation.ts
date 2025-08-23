import { z } from "zod";

const TaskCreationSchema = z
  .object({
    id: z.uuid(),
    title: z
      .string("invalid title")
      .min(10, "Title must be minimum 20 characters long")
      .max(80, "Title must be maximum 80 characters long"),
    description: z
      .string("invalid description")
      .min(20, "Descripiton must be minimum 20 characters long")
      .max(300, "Descripiton must be maximum 200 characters long"),
    assignees: z.array(z.uuid()),
    assignedOn: z.date(),
    dueDate: z.date(),
    completed: z.boolean(),
    completedOn: z.null(),
    organizationId: z.uuid(),
    note: z.string(),
  })
  .strict();

export default TaskCreationSchema;
