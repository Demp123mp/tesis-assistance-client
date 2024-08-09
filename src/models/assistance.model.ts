import { z } from 'zod';

// Expresión regular para validar un ObjectId de MongoDB
export const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const AssistanceSchema = z.object({
  _id: z.string().regex(objectIdRegex),
  id: z.string().trim(),
  worker: z.string().trim(),
  date: z.date(),
  type: z.enum(['in', 'out']),
  createdAt: z.date(),
  updatedAt: z.date()
});
export const CreateAssistanceSchema = z.object({
  worker: z.string().trim(),
  date: z.date().or(z.string()),
  type: z.enum(['in', 'out']),
});

export type IAssistance = z.infer<typeof AssistanceSchema>;

export type ICreateAssistant = z.infer<typeof CreateAssistanceSchema>;