import { CustomProgress } from "@/components/custom/customProgress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Target } from "lucide-react";
import { useTranslations } from "next-intl";

interface SingleGoalInfoCardType {
    goal: GoalType
}

export default function SingleGoalInfoCard({ goal }: SingleGoalInfoCardType) {
    const t = useTranslations()
    const daysDuration = ((new Date(goal.endDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const progressPercent = Math.round((goal.completedDays / daysDuration) * 100);

    // Format dates for better display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
        });
    };

    // Calculate days remaining
    const today = new Date();
    const endDate = new Date(goal.endDate);
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    return (
        <Card className="shadow-sm p-0 bg-background border border-border/50 hover:border-border hover:shadow-md transition-all duration-200 group">
            <CardContent className="p-4">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-grow pr-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Target className="h-3 w-3 text-goals flex-shrink-0" />
                            <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-goals transition-colors">
                                {goal.title}
                            </h4>
                        </div>
                        {goal.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {goal.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                        <Badge
                            variant="outline"
                            className="border-goals  bg-goals/10 text-goals font-semibold text-xs px-2 py-1"
                        >
                            {progressPercent}%
                        </Badge>
                        {daysRemaining > 0 && (
                            <span className="text-xs text-muted-foreground font-medium">
                                {daysRemaining}{t("common.left-days")}
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-2">
                    <CustomProgress
                        value={progressPercent}
                        backgroundColor="bg-goals/20"
                        fillColor="bg-goals"
                        headerPosition="outside"
                        showTitle
                        textColor="text-goals"
                    />

                    {/* Date Range */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{formatDate(goal.startDate)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="w-8 border-t border-dashed border-muted-foreground/40"></div>
                            <span className="text-xs text-muted-foreground font-medium">
                                {Math.ceil(daysDuration)} {t("common.days")}
                            </span>
                            <div className="w-8 border-t border-dashed border-muted-foreground/40"></div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="font-medium">{formatDate(goal.endDate)}</span>
                            <Calendar className="h-3 w-3" />
                        </div>
                    </div>

                    {/* Progress Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <div className="text-xs">
                            <span className="text-muted-foreground">{t("common.completed")}: </span>
                            <span className="font-semibold text-goals">{goal.completedDays}</span>
                            <span className="text-muted-foreground"> / {Math.ceil(daysDuration)} {t("common.days")}</span>
                        </div>

                        {progressPercent >= 100 ? (
                            <Badge variant="default" className="bg-succett/10 text-success border-success text-xs">
                                ✓ {t("common.completed")}
                            </Badge>
                        ) : progressPercent >= 75 ? (
                            <Badge variant="outline" className="border-goals text-goals bg-goals/5 text-xs">
                                {t("common.almost-there")}
                            </Badge>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}