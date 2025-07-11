import { useEffect, useState } from "react";
import { z } from "zod";

const ResetStatisticsSchema = z.object({
  reset_type: z.string(),
  total_resets: z.number(),
  successful_resets: z.number(),
  failed_resets: z.number(),
  success_rate: z.number(),
  avg_execution_time_ms: z.number(),
});

export type ResetStatistics = z.infer<typeof ResetStatisticsSchema>;

export function useResetStatistics(startDate: string, endDate: string) {
  const [data, setData] = useState<ResetStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/reset/statistics?start=${startDate}&end=${endDate}`);
        const json = await res.json();
        const parsed = z.array(ResetStatisticsSchema).parse(json);
        setData(parsed);
      } catch (err: any) {
        console.error("Reset statistics fetch failed", err);
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [startDate, endDate]);

  return data;
}
