"use client"

import { ResetLog } from '@/hooks/reset/useRecentResetLogs';
import { ResetStatistics } from '@/hooks/reset/useResetStatistics';
import { useState } from 'react';
import { ResetResult, triggerManualReset } from '@/hooks/reset/useTriggerManualReset';
import PageHeader from '../customs/header';
import { TestTube, TimerReset } from 'lucide-react';
import ConfirmModal from '@/components/custom/confirmModal';
import { useProfile } from '@/lib/Queries/useProfile';
import StatCard from '../customs/statCard';
import { useAdminUsers } from '@/lib/Queries/admin/usersManagment/useAdminUsers';

export const ResetAdminDashboard: React.FC = () => {

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0],
    });

    const { data: users } = useAdminUsers();

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
        /*    setStatistics(useResetStatistics(dateRange.start, dateRange.end));
            setRecentLogs(useRecentResetLogs(20))
            setIsResetInProgress(useResetProgress())*/
        setLoading(false)
    };


    const resetUser = async (userId: string) => {
        try {
            await fetch("/api/reset/user", {
                method: "POST",
                body: JSON.stringify({ userIds: [userId] })
            })

        } catch (err) {
            console.log(err)
        }

    }


    return (
        <div className="p-6 space-y-6 bg-background text-foreground">

            <PageHeader
                title="Reset System Dashboard"
                pageIcon={TimerReset}
                subtitle="Monitor and manage the daily reset system for habits and goals"
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

            <div className="bg-card p-4 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-card-foreground">System Status</h2>
                <div className='py-2 flex gap-2'>
                    <StatCard icon={TimerReset} text="Last Reset" stat={recentLogs[0]?.timestamp || ""} iconColor='text-success' />
                    <StatCard icon={TimerReset} text="Next Reset" stat={recentLogs[0]?.timestamp || ""} iconColor='text-warning' />
                </div>
            </div>

            <div className="bg-card p-4 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-card-foreground">Users</h2>
                {
                    users
                    &&
                    users.map((user: AdminUser) =>
                        <div key={user.id} className='flex gap-3'>
                            <p>{user.email}</p>

                            <button onClick={
                                () => {
                                    resetUser(user.id)
                                }
                            }>
                                Reset User
                            </button>
                        </div>
                    )
                }
            </div>

            {/* Edge Function Status */}
            <div className="bg-card p-6 rounded-lg border border-border">
                <h2 className="text-xl font-semibold text-card-foreground mb-4">
                    Edge Function Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h3 className="font-medium text-card-foreground mb-2">Functions</h3>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• daily-reset: Main reset processing function</li>
                            <li>• cron-reset-trigger: Cron job trigger endpoint</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-medium text-card-foreground mb-2">Scheduling</h3>
                        <ul className="space-y-1 text-muted-foreground">
                            <li>• Timezone-aware processing</li>
                            <li>• Automatic retry on failure</li>
                            <li>• Comprehensive logging</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-card p-4 rounded border border-border">
                <h3 className="font-medium text-foreground mb-3">How the Reset Works</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                    <div>
                        <strong className="text-foreground">Habits:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>If completed today ≥ frequency per day: streak +1</li>
                            <li>If not completed and allowSkip = false: streak = 0</li>
                            <li>If not completed and allowSkip = true: streak stays same</li>
                            <li>Only processes habits on selected days (for non-daily habits)</li>
                            <li>Resets completedToday to 0</li>
                        </ul>
                    </div>

                    <div>
                        <strong className="text-foreground">Goals:</strong>
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