import { z } from 'zod';
import { createClient } from '@/lib/supabase/client'; 

const supabase = createClient();

// Types for edge function responses
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

const ResetStatisticsSchema = z.object({
    reset_type: z.string(),
    total_resets: z.number(),
    successful_resets: z.number(),
    failed_resets: z.number(),
    success_rate: z.number(),
    avg_execution_time_ms: z.number(),
});

type ResetResult = z.infer<typeof ResetResultSchema>;
type ResetLog = z.infer<typeof ResetLogSchema>;
type ResetStatistics = z.infer<typeof ResetStatisticsSchema>;

export class EdgeFunctionManager {

    // Trigger manual reset via edge function
    static async triggerManualReset(): Promise<ResetResult> {
        const { data, error } = await supabase.functions.invoke('daily-reset', {
            body: {
                triggered_by: 'manual',
                timestamp: new Date().toISOString(),
            },
        });

        if (error) {
            console.error('Error triggering manual reset:', error);
            throw error;
        }

        return ResetResultSchema.parse(data);
    }

    // Get reset statistics
    static async getResetStatistics(
        startDate?: string,
        endDate?: string
    ): Promise<ResetStatistics[]> {
        const { data, error } = await supabase.rpc('get_reset_statistics', {
            start_date: startDate,
            end_date: endDate,
        });

        if (error) {
            console.error('Error fetching reset statistics:', error);
            throw error;
        }

        return z.array(ResetStatisticsSchema).parse(data);
    }

    // Get user reset history
    static async getUserResetHistory(
        userId: string,
        limit: number = 10
    ): Promise<ResetLog[]> {
        const { data, error } = await supabase.rpc('get_user_reset_history', {
            p_user_id: userId,
            limit_count: limit,
        });

        if (error) {
            console.error('Error fetching user reset history:', error);
            throw error;
        }

        return z.array(ResetLogSchema).parse(data);
    }

    // Get recent reset logs (admin function)
    static async getRecentResetLogs(limit: number = 50): Promise<ResetLog[]> {
        const { data, error } = await supabase
            .from('reset_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            console.error('Error fetching recent reset logs:', error);
            throw error;
        }

        return z.array(ResetLogSchema).parse(data);
    }

    // Check if reset is currently running
    static async isResetInProgress(): Promise<boolean> {
        const { data, error } = await supabase
            .from('reset_logs')
            .select('id')
            .eq('status', 'in_progress')
            .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString()) // Last 30 minutes
            .limit(1);

        if (error) {
            console.error('Error checking reset progress:', error);
            return false;
        }

        return data.length > 0;
    }
}