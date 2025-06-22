'use client'

import { useUpdateProfile } from '@/lib/Mutations/profiles/useUpdateProfile'
import { useProfile } from '@/lib/Queries/useProfile'
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'

export type ThemePreference = 'light' | 'dark' | 'neutral' | 'system'
type Theme = 'light' | 'dark' | 'neutral'

interface ThemeContextType {
  theme: Theme
  themePreference: ThemePreference
  setThemePreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system')
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  const { data: profile } = useProfile()
  const updateProfile = useUpdateProfile(profile?.id || "")

  const setThemePreference = (preference: ThemePreference) => {
    setThemePreferenceState(preference)
    if (profile?.id) {
      updateProfile.mutate({ updates: { theme: preference } })
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (themePreference === 'system') {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const updateTheme = () => {
        setTheme(darkQuery.matches ? 'dark' : 'light')
      }
      updateTheme()
      darkQuery.addEventListener('change', updateTheme)
      return () => darkQuery.removeEventListener('change', updateTheme)
    } else {
      setTheme(themePreference)
    }
  }, [themePreference])

  useEffect(() => {
    if (mounted) {
      const target = document.documentElement
      target.setAttribute('data-theme', theme)
    }
  }, [theme, mounted])

  useEffect(() => {
  if (profile?.theme) {
    setThemePreferenceState(profile.theme as ThemePreference)
  }
}, [profile])

  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, themePreference, setThemePreference }}>
      <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside ThemeProvider')
  return context
}
