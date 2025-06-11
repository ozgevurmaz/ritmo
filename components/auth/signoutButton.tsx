import { handleLogout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useTranslations } from "next-intl"

export default function SignOutButton() {
    const t = useTranslations("buttons")
    return (
        <Button onClick={() => handleLogout()} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            {t("logout")}
        </Button>
    )
}
