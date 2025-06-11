'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTransition } from "react"
import { Languages } from "lucide-react"
import { useLocale } from "next-intl"
import { Locale } from "@/lib/i18n/config"
import { setUserLocale } from "@/lib/i18n/locale"

export const LanguageSelect = () => {
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()

  const handleChange = (value: string) => {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <Select value={currentLocale} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] bg-muted">
        <Languages className="h-5 w-5 mr-2" />
        <SelectValue placeholder="Select Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇺🇸 English</SelectItem>
        <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
      </SelectContent>
    </Select>
  )
}
