import { getStreakColor } from "@/lib/utils/features/getStreakColor";
import { Flame } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SteakBadge({ streak, isTextShown = false, isSmall, border = true }: { border?: boolean, streak: number, isTextShown?: boolean, isSmall?: boolean }) {
    const t = useTranslations()
    return (
        <div className={`flex items-center gap-1 px-2 py-1 ${border ? "border-2" : ""} font-semibold rounded-lg ${getStreakColor(streak)} ${isSmall && "scale-75"}`}>
            <Flame className="h-5 w-5" />
            {streak}
            {isTextShown && <span className="hidden md:inline">{t("common.days")}</span>}
        </div>
    )
}