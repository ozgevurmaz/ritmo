import { CustomProgress } from "@/components/custom/customProgress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SingleGoalInfoCardType {
    goal: GoalType
}
export default function SingleGoalInfoCard({ goal }: SingleGoalInfoCardType) {
    const daysDuration = ((new Date(goal.endDate).getTime() - new Date(goal.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const progressPercent = Math.round((goal.complatedDays / daysDuration) * 100);

    return (
        <Card className="shadow-none bg-muted border-border">
            <CardContent className="p-3">
                <div className="flex justify-between items-start">
                    <div className="flex-grow">
                        <h4 className="font-medium text-sm text-foreground">{goal.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{goal.description}</p>
                    </div>
                    <Badge variant="outline" className="ml-2 border-goals bg-goals/10 text-goals">
                        {progressPercent}%
                    </Badge>
                </div>

                <div className="mt-3">
                    <CustomProgress value={progressPercent} backgroundColor="bg-goals/30" fillColor="bg-goals" headerPosition="outside" showTitle textColor="text-goals" />

                    <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                        <span>{goal.startDate}</span>
                        <span>{goal.endDate}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}