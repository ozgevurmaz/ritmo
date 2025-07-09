import z from "zod";

export const searchSchema = z.object({
    query: z.string().optional(),
    status: z.enum(['all', 'active', 'banned', 'unconfirmed']).optional(),
    provider: z.enum(['all', 'email']).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;