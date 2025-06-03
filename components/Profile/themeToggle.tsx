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

export const ThemeToggle = () => {
  const { setThemePreference } = useTheme()

  return (
    <Select name="theme" onValueChange={(value: ThemePreference) => setThemePreference(value)}>
      <SelectTrigger className="w-[180px] bg-muted">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light"><Sun className="h-5 w-5" /> Light</SelectItem>
        <SelectItem value="dark"><Moon className="h-5 w-5" /> Dark</SelectItem>
        <SelectItem value="neutral"><Leaf className="h-5 w-5" /> Neutral</SelectItem>
      </SelectContent>
    </Select>
  )
}
