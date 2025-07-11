import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import SingleGoalInfoCardType from "../../Goals/singleGoalInfoCardType";
import Link from "next/link";
import { GoalBriefing } from "../../Goals/goalsBriefing";
import { useTranslations } from "next-intl";

export default function GoalsInfoCard(
    {
        goals,
        upcomingGoals,
    }: {
        goals: GoalType[]
        upcomingGoals: GoalType[]
    }
) {
    const t = useTranslations("goals-info")
    return (
        <Card className="mb-5 border-primary overflow-y-auto gap-2">
            <CardHeader className="pb-2 mb-0">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold flex items-center text-foreground">
                        <Target className="h-4 w-4 mr-2 text-foreground" />
                        <span>{t("title")}</span>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-3 flex flex-col items-center justify-center gap-2">
                {
                    goals.length === 0 &&
                    <div className="flex flex-col items-center justify-center py-4 px-2 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Target className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {t("empty-title")}
                        </h3>

                        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                            {t("empty-description")}
                        </p>

                        <Link href="/dashboard/goals/add" className="text-primary">
                            {t("add-first-goal")}
                        </Link>
                    </div>
                }

                {goals.length > 0 &&
                    <div className="space-y-3 p-1 w-full">
                        {goals.map((goal) =>
                            <SingleGoalInfoCardType key={goal.id} goal={goal} />
                        )}
                    </div>
                }

                {upcomingGoals.length > 0 && (
                    <div className="w-full mt-6 pt-4 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-muted-foreground opacity-60"></div>
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                {t("upcoming-title")}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {upcomingGoals.map((goal) => (
                                <GoalBriefing goal={goal} key={goal.id} />
                            ))}
                        </div>

                        <Link
                            href="/dashboard/goals"
                            className="inline-flex items-center gap-1 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <span>{t("view-all")}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </CardContent>

        </Card>
    )
}