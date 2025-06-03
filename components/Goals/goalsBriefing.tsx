import { formatDate } from '@/lib/utils'
import React from 'react'

export const GoalBriefing = ({ goal }: { goal: GoalType }) => {
    return (
        <div
            key={goal.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50"
        >
            <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-1">
                    {goal.title}
                </h4>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                        Starts on
                    </span>
                    <span className="text-xs font-medium text-goals bg-background px-2 py-1 rounded border border-goals">
                        {formatDate(new Date(goal.endDate), { day: '2-digit', month: '2-digit', weekday: 'short', year: false })}
                    </span>
                </div>
            </div>

            <div className="flex items-center ml-4">
                <div className="w-2 h-2 rounded-full bg-goals"></div>
            </div>
        </div>
    )
}
