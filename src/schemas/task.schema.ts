import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    description: z.string().optional().default(""),
    status: z.enum(["pending", "in-progress", "done"]),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional()
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "in-progress", "done"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z.string().datetime().nullable()
  }),
});
