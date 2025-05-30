import z from "zod";

export const profileSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .max(100, "Name must be less than 100 characters"),
    surname: z
        .string(),
    email: z.string(),
    username: z
        .string()
        .min(1, "Username is required.")
        .max(30, 'Username must be less than 30 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
})