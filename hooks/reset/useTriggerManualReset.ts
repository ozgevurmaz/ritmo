import z from "zod";

const ResetResultSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    processed: z.number().optional(),
    successful: z.number().optional(),
    failed: z.number().optional(),
    details: z.array(z.object({
        success: z.boolean(),
        userId: z.string(),
        error: z.string().optional(),
    })).optional(),
});

export type ResetResult = z.infer<typeof ResetResultSchema>;

export const triggerManualReset = async () => {

    try {
        const res = await fetch("/api/reset/manual", { method: "POST" });
        const json = await res.json();

        if (!res.ok) {
            console.error("Manual reset failed:", json);
            throw new Error(json.error || "Unexpected error");
        }

        const parsed = ResetResultSchema.parse(json);

        return {
            data: parsed,
            isPending: true
        }
    } catch (error: any) {
        console.error("Manual reset error:", error);
        return {
            isPending: false,
            error: error?.message || "Unexpected error",
        };
    }
};