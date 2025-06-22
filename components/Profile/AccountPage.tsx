"use client"

import { useProfile } from '@/lib/Queries/useProfile'
import { useTranslations } from 'next-intl'
import LoadingScreen from '../shared/pageStyles/Loading'
import AccountSettingForm from '../Profile/AccountSettings'
import InformationCard from '../shared/InformationCard'
import { useRouter } from 'next/navigation'
import SecuritySettingsForm from './SecuritySettingsForm'
import AppearanceSettingsForm from './AppearanceSettingsForm'
import { VisibilitySettingsForm } from './VisibilitySettingsForm'
import { AccountDangerZone } from './AccountDangerZone'

export default function AccountPage() {
  const t = useTranslations("account")
  const router = useRouter()

  const { data: profileData, isLoading, isError, error } = useProfile()

  if (isLoading) return <LoadingScreen />
  if (isError) {
    return <div>{`Error: ${error.message}`}</div>
  }
  if (!profileData) {
    router.push("/auth")
    return null
  }

  return (
    <div className="mx-auto p-4 space-y-4">

      <InformationCard title={t("profile.title")} description={t("profile.description")}>
        <AccountSettingForm profile={profileData} />
      </InformationCard>

      <InformationCard title={t("security.description")} description={t("security.description")}>
        <SecuritySettingsForm profile={profileData} />
      </InformationCard>

      <InformationCard title={t("appearance.title")} description={t("appearance.description")}>
        <AppearanceSettingsForm profile={profileData} />
      </InformationCard>
      
      <InformationCard
        title={t("visibility.title")}
        description={t("visibility.description")}
      >
        <VisibilitySettingsForm profile={profileData} />
      </InformationCard>

      <InformationCard
        title={t("danger.title")}
        description={t("danger.description")}
      >
        <AccountDangerZone profile={profileData} />
      </InformationCard>
    </div>
  )
}
