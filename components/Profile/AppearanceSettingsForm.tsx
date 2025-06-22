'use client'

import { ThemeToggle } from './themeToggle'
import { LanguageSelect } from './languageSelect'
import { useTranslations } from 'next-intl'

interface AppearanceSettingsFormProps {
  profile: UserType
}

const AppearanceSettingsForm = ({ profile }: AppearanceSettingsFormProps) => {
  const t = useTranslations()
  
  return (
    <div className="grid grid-cols-2  gap-6 col-span-2">
      {/* Theme Settings */}
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("theme.placeholder")}</p>
        <ThemeToggle />
      </div>
      
      {/* Language Settings */}
      <div className="space-y-2">
        <p className="text-sm font-medium">{t("languages.placeholder")}</p>
        <LanguageSelect />
      </div>
    </div>
  )
}

export default AppearanceSettingsForm