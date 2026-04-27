import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Your email is required"),
  password: z.string().min(8, "Minimum 8 characters"),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
