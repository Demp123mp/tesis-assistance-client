import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().trim(),
  _id: z.string().trim(),
  firstname: z.string().min(3).max(15),
  lastname: z.string().min(3).max(15),
  document: z
    .string()
    .trim()
    .min(7)
    .max(8)
    .regex(/^[0-9]{7,8}$/),
  password: z.string().min(8),
  access: z.enum(['admin', 'worker']),
  rol: z.enum(['manager', 'administration', 'worker', 'vice-rector']),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const CreateUserSchema = z.object({
  firstname: z.string().min(3).max(15),
  lastname: z.string().min(3).max(15),
  document: z
    .string()
    .trim()
    .min(7)
    .max(8)
    .regex(/^[0-9]{7,8}$/),
  password: z.string().min(8),
  access: z.enum(['admin', 'worker']),
  rol: z.enum(['manager', 'administration', 'worker', 'vice-rector']),
});

export type IUser = z.infer<typeof UserSchema>;

export type ICreateUser = z.infer<typeof CreateUserSchema>;
