import { handleLogout } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function SignOutButton() {

    return (
        <Button onClick={() => handleLogout()} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
        </Button>
    )
}
