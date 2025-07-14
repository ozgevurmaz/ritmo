import z from "zod";

export const goalSchema = z.object({
  title: z.string().min(3, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
  motivation: z.string().max(300, "Motivation must be less than 300 characters"),
  habits: z.array(z.string()).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  sharedWith: z.array(z.string()).optional(),
  visibility: z.enum(["public", "private"]),
  category: z.string().min(1, "Please select a category"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return end > start;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const habitSchema = z.object({
  title: z.string().min(3, "Habit title required"),
  frequencyPerDay: z.number().min(1, "Frequency must be at least 1").max(20, "Maximum 24 times per day"),
  allowSkip: z.boolean(),
  reminderTimes: z.array(z.string()).optional(),
  weeklyFrequency: z.number().max(7),
  selectedDays: z.array(z.string())
})

export const habitFormSchema = z.object({
  title: z.string().min(3, "Habit title required"),
  frequencyPerDay: z.number().min(1, "Frequency must be at least 1").max(20, "Maximum 20 times per day"),
  allowSkip: z.boolean(),
  reminderTimes: z.array(z.string()).optional(),
  weeklyFrequency: z.number().min(1).max(7),
  selectedDays: z.array(z.string()),

  goal: z.string().nullable().optional(),
  customMessage: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  startDate: z.string(),
  endDate: z.string(),
  visibility: z.enum(['public', 'private']),
  sharedWith: z.array(z.string())
});

export type HabitData = z.infer<typeof habitSchema>;
export type HabitFormValues = z.infer<typeof habitFormSchema>;

export interface HabitType extends HabitFormValues {
  id: string;
  created_at: string;
  weeklyCompleted: number;
  completedToday: boolean;
  streak: number;
}

export type NewGoalHabit = HabitData & {
  goal: string | null;
  customMessage: string;
  category: string;
  startDate: string;
  endDate: string;
  visibility: 'public' | 'private';
  sharedWith: string[];
};

export type CreateHabitPayload = Omit<HabitType, "id" | "created_at" | "weeklyCompleted" | "completedToday" | "streak">;

export type UpdateHabitPayload = Partial<CreateHabitPayload> & {
  id: string;
};

// Helper type for goal habit management
export type GoalHabitInput = Omit<HabitType, "id" | "created_at" | "weeklyCompleted" | "completedToday" | "streak">;
