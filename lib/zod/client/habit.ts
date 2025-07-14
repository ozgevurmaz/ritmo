import z from "zod";

export const createGoalSchema = (isEdit: boolean) => z.object({
    title: z.string()
        .min(1, "Habit title is required")
        .max(60, "Title must be less than 60 characters"),
    goal: z.string().nullable(),
    frequencyPerDay: z.number()
        .min(1, "Frequency must be at least 1")
        .max(20, "Maximum 24 times per day"),
    customMessage: z.string()
        .max(200, "Message must be less than 200 characters")
        .optional(),
    allowSkip: z.boolean(),
    category: z.string().min(1, "Category is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sharedWith: z.array(z.string()).optional(),
    reminderTimes: z.array(z.string()).optional(),
    visibility: z.enum(["public", "private"]),
    weeklyFrequency: z.number().max(7),
    selectedDays: z.array(z.string())
}).refine((data) => {
    // Check if start date is provided and valid
    if (data.startDate && !isEdit) {
        const startDate = new Date(data.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return startDate >= today;
    }
    return true;
}, {
    message: "Start date must be today or in the future",
    path: ["startDate"]
}).refine((data) => {
    // Check if end date is provided and valid (today or future)
    if (data.endDate) {
        const endDate = new Date(data.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return endDate >= today;
    }
    return true;
}, {
    message: "End date must be today or in the future",
    path: ["endDate"]
}).refine((data) => {
    // Check if both dates are provided and end date is after start date
    if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        // Normalize dates to avoid time zone issues
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        return endDate > startDate;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"]
});