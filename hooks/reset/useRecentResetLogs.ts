import { useState, useEffect } from "react";
import z from "zod";

const ResetLogSchema = z.object({
    id: z.string(),
    user_id: z.string(),
    reset_type: z.string(),
    status: z.enum(['success', 'failed', 'in_progress']),
    error_message: z.string().nullable(),
    execution_time_ms: z.number().nullable(),
    timestamp: z.string(),
    created_at: z.string(),
});

export type ResetLog = z.infer<typeof ResetLogSchema>;

export function useRecentResetLogs(limit = 50) {
    const [data, setData] = useState<ResetLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/reset/logs?limit=${limit}`);
                const json = await res.json();

                const parsed = z.array(ResetLogSchema).parse(json);
                setData(parsed);
            } catch (err: any) {
                console.error("Reset logs fetch failed", err);
                setError(err.message || "Failed to fetch");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 30_000);

        return () => clearInterval(interval);
    }, [limit]);

    return data;
}
