
import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number
    max?: number
    title?: string
    backgroundColor?: string
    fillColor?: string
    showPercentage?: boolean
    showTitle?: boolean
    textColor?: string
    headerPosition?: "outside" | "none"
    animated?: boolean
}

export const CustomProgress = React.forwardRef<HTMLDivElement, CustomProgressProps>(
    ({
        className,
        value = 0,
        max = 100,
        backgroundColor = "bg-muted",
        fillColor = "bg-primary",
        title = "Progress",
        showPercentage = false,
        headerPosition = "none",
        textColor = "text-primary",
        animated = false,
        showTitle = false,
        ...props
    }, ref) => {
        const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

        return (
            <div className="w-full space-y-1">
                {headerPosition === "outside" && (
                    <div className="flex justify-between text-sm text-primary">
                        {showTitle && <span className={cn(textColor)}>{title}</span>}
                        {showPercentage && <span className={cn("font-medium", textColor)}>{Math.round(percentage)}%</span>}
                    </div>
                )}

                <div
                    ref={ref}
                    className={cn(
                        "relative w-full overflow-hidden rounded-full h-2",
                        backgroundColor,
                        className
                    )}
                    {...props}
                >
                    <div
                        className={cn(
                            "h-full transition-all duration-500 ease-in-out",
                            fillColor,
                            animated && "transition-transform",
                        )}
                        style={{
                            width: `${percentage}%`,
                            ...(animated && {
                                backgroundImage: `linear-gradient(
                  45deg,
                  rgba(255, 255, 255, 0.15) 25%,
                  transparent 25%,
                  transparent 50%,
                  rgba(255, 255, 255, 0.15) 50%,
                  rgba(255, 255, 255, 0.15) 75%,
                  transparent 75%,
                  transparent
                )`,
                                backgroundSize: '20px 20px',
                                animation: 'progress-stripes 1s linear infinite'
                            })
                        }}
                    />
                </div>
            </div>
        )
    }
)

CustomProgress.displayName = "CustomProgress"