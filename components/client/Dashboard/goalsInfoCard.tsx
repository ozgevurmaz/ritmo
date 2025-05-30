import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Target } from "lucide-react";
import SingleGoalInfoCardType from "./singleGoalInfoCardType";
import Link from "next/link";

export default function GoalsInfoCard(
    {
        goals,
        setGoalFormOpen
    }: {
        goals: GoalType[]
        setGoalFormOpen?: () => void,
    }
) {

    return (
        <Card className="mb-5 border-primary">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold flex items-center text-foreground">
                        <Target className="h-4 w-4 mr-2 text-foreground" />
                        <span>Active Goals</span>
                    </CardTitle>
                    <Button
                        onClick={setGoalFormOpen}
                        size="sm"
                        variant="outline"
                        className="border-goals bg-goals/10 text-goals hover:bg-goals hover:text-primary-foreground transition-all duration-200">
                        <PlusCircle className="h-3.5 w-3.5 mr-1" />
                        Add Goal
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="pt-3 flex flex-col items-center justify-center gap-3">
                <div className="space-y-3 max-h-56 overflow-y-auto p-1">
                    {goals.map((goal) =>
                        <SingleGoalInfoCardType key={goal.id} goal={goal} />
                    )}
                </div>

                <Link href="/goals" className="max-w-max mt-2 px-2 py-1 text-xs text-foreground hover:text-foreground/80">
                    View All Goals
                </Link>
            </CardContent>
        </Card>
    )
}