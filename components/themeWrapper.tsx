'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ThemeWrapperProps {
  children: ReactNode
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const isDark = darkQuery.matches
    setTheme(isDark ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }
    darkQuery.addEventListener('change', handleChange)
    return () => darkQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <div data-theme={theme}>
      <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
        {children}
      </div>
    </div>
  )
}
