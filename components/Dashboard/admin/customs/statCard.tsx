import { LucideIcon } from 'lucide-react'
import React from 'react'

type Props = {
    text: string
    stat: string
    icon: LucideIcon
    iconColor: string
}

const StatCard = ({ text, stat, icon, iconColor }: Props) => {
    const Icon = icon
    return (
        <div
            className="rounded-lg p-6 border bg-card border-border"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                        {text}
                    </p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-card-foreground)' }}>
                        {stat}
                    </p>
                </div>
                <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>
        </div>
    )
}

export default StatCard