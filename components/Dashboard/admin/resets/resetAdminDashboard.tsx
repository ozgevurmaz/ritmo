"use client"

import { ResetLog, useRecentResetLogs } from '@/hooks/reset/useRecentResetLogs';
import { useResetProgress } from '@/hooks/reset/useResetProgress';
import { ResetStatistics, useResetStatistics } from '@/hooks/reset/useResetStatistics';
import { useState } from 'react';
import { ResetResult, triggerManualReset } from '@/hooks/reset/useTriggerManualReset';
import PageHeader from '../customs/header';
import { TestTube, TimerReset } from 'lucide-react';
import ConfirmModal from '@/components/custom/confirmModal';

export const ResetAdminDashboard: React.FC = () => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });

    const [manualReset, setManualReset] = useState<{
        isPending: boolean;
        data?: ResetResult;
        error?: string;
    }>({
        isPending: false,
    });

    const [statistics, setStatistics] = useState<ResetStatistics[]>([])
    const [recentLogs, setRecentLogs] = useState<ResetLog[]>([])
    const [isResetInProgress, setIsResetInProgress] = useState<boolean>()
    const [loading, setLoading] = useState<boolean>(false)


    const handleManualReset = async () => {
        setIsConfirmModalOpen(false)
        setLoading(true)
        const res = await triggerManualReset()
        setManualReset(res)
        setStatistics(useResetStatistics(dateRange.start, dateRange.end));
        setRecentLogs(useRecentResetLogs(20))
        setIsResetInProgress(useResetProgress())
        setLoading(false)

    };



    return (
        <div className="p-6 space-y-6 bg-[var(--color-background)] text-[var(--color-foreground)]">

            <PageHeader
                title="Reset System Dashboard"
                pageIcon={TimerReset}
                subtitle=" Monitor and manage the daily reset system for habits and goals"
                buttonIcon={TestTube}
                buttonText="Start Manual Test"
                buttonAction={() => setIsConfirmModalOpen(true)}
            />

            {
                isConfirmModalOpen === true &&
                <ConfirmModal
                    isOpen={isConfirmModalOpen}
                    setIsOpen={setIsConfirmModalOpen}
                    title="Trigger a manual reset"
                    subtitle="Are you sure you want to trigger a manual reset for all users?"
                    cancelButton='Cancel'
                    action={handleManualReset}
                    actionButton='Start'
                />
            }







            {/* Edge Function Status */}
            <div className="bg-[var(--color-card)] p-6 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-semibold text-[var(--color-card-foreground)] mb-4">
                    Edge Function Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h3 className="font-medium text-[var(--color-card-foreground)] mb-2">Functions</h3>
                        <ul className="space-y-1 text-[var(--color-muted-foreground)]">
                            <li>• daily-reset: Main reset processing function</li>
                            <li>• cron-reset-trigger: Cron job trigger endpoint</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-[var(--color-card-foreground)] mb-2">Scheduling</h3>
                        <ul className="space-y-1 text-[var(--color-muted-foreground)]">
                            <li>• Timezone-aware processing</li>
                            <li>• Automatic retry on failure</li>
                            <li>• Comprehensive logging</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-[var(--color-surface)] p-4 rounded border border-[var(--color-border)]">
                <h3 className="font-medium text-[var(--color-foreground)] mb-3">How the Reset Works</h3>
                <div className="text-sm text-[var(--color-muted-foreground)] space-y-2">
                    <div>
                        <strong className="text-[var(--color-foreground)]">Habits:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>If completed today ≥ frequency per day: streak +1</li>
                            <li>If not completed and allowSkip = false: streak = 0</li>
                            <li>If not completed and allowSkip = true: streak stays same</li>
                            <li>Only processes habits on selected days (for non-daily habits)</li>
                            <li>Resets completedToday to 0</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-[var(--color-foreground)]">Goals:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>If all associated habits are completed: completedDays +1</li>
                            <li>If end date is reached: mark as completed</li>
                            <li>Only processes incomplete goals</li>
                        </ul>
                    </div>
                </div>
            </div>


        </div>
    );
};