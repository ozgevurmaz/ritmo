import z from "zod";

export const habitSchema = z.object({
    title: z.string()
        .min(1, "Habit title is required")
        .max(60, "Title must be less than 60 characters"),
    goal: z.string().nullable(),
    frequencyPerDay: z.number()
        .min(1, "Frequency must be at least 1")
        .max(20, "Maximum 20 times per day"),
    customMessage: z.string()
        .max(200, "Message must be less than 200 characters")
        .optional(),
    allowSkip: z.boolean(),
    category: z.string().min(1, "Category is required"),
    endDate: z.string().optional(),
    sharedWith: z.array(z.string()).optional(),
    visibility: z.enum(["public", "private"]),
    weeklyFrequency: z.number().max(7),
    selectedDays: z.array(z.string())
}).refine((data) => {
    if (!data.endDate) return true;
    const endDate = new Date(data.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return endDate >= today;
}, {
    message: "End date must be today or in the future",
    path: ["endDate"]
});