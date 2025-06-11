'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemePreference, useTheme } from "@/context/theme-context"
import { Leaf, Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"

export const ThemeToggle = () => {
  const t = useTranslations("theme")
  const { setThemePreference } = useTheme()

  return (
    <Select name="theme" onValueChange={(value: ThemePreference) => setThemePreference(value)}>
      <SelectTrigger className="w-[180px] bg-muted">
        <SelectValue placeholder={t("placeholder")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light"><Sun className="h-5 w-5" /> {t("themes.light")}</SelectItem>
        <SelectItem value="dark"><Moon className="h-5 w-5" />{t("themes.dark")}</SelectItem>
        <SelectItem value="neutral"><Leaf className="h-5 w-5" /> {t("themes.neutral")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
