'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemePreference, useTheme } from "@/context/theme-context"

export const ThemeToggle = () => {
  const { setThemePreference } = useTheme()

  return (
      <Select name="theme" onValueChange={(value: ThemePreference) => setThemePreference(value)}>
        <SelectTrigger className="w-[180px] bg-muted">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
  )
}
