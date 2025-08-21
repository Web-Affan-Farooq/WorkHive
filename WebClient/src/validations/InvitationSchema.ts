import { z } from "zod";

const InviteSchema = z
  .object({
    inviteeEmail: z.email(),
    departmentId: z.uuid(),
    organizationEmail: z.uuid(),
  })
  .strict();
export default InviteSchema;
