import { getStreakColor } from "@/lib/utils";
import { Flame } from "lucide-react";

export default function SteakBadge({ streak, isTextShown = false, isSmall }: { streak: number, isTextShown?: boolean, isSmall?: boolean }) {

    return (
        <div className={`flex items-center gap-1 px-2 py-1 border rounded-lg ${getStreakColor(streak)} ${isSmall && "scale-75"}`}>
            <Flame className="h-5 w-5" />
            {streak}
            <span className="hidden md:inline"> day {isTextShown && "streak"}</span>
        </div>
    )
}