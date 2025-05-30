import z from "zod";

export const goalSchema = z.object({
  title: z.string().min(3, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters"),
  motivation: z.string().max(300, "Motivation must be less than 300 characters"),
  habits: z.array(z.string()).min(1, "Please select at least one habit"),
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