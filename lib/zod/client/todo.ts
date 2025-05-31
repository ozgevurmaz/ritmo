import z from "zod";

export const todoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    urgent: z.enum(["High", "Medium", "Low"]),
    importance: z.enum(["High", "Medium", "Low"]),
    deadline: z.string().min(1, "Deadline is required"),
    time: z.string().nullable(),
    notifyBefore: z.string().min(1, "Notification time is required"),
    repeat: z.enum(["never", "daily", "weekly", "monthly", "yearly"]),
    tags: z.array(z.string()),
    category: z.string().min(1, "Category is required"),
    sharedWith: z.array(z.string()).optional(),
    visibility: z.enum(["public", "private"]),
    type: z.enum(["task", "event"]),
})