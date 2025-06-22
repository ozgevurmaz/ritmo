'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { Switch } from '../ui/switch'

interface VisibilitySettingsFormProps {
    profile: UserType
}

export const VisibilitySettingsForm = ({ profile }: VisibilitySettingsFormProps) => {
    const t = useTranslations("account.visibility.visibility")
    const [isPrivate, setIsPrivate] = useState( false)
    const [allowFriendRequests, setAllowFriendRequests] = useState( true)
    const [showInSearch, setShowInSearch] = useState( true)
    const [loading, setLoading] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="private-account">{t('private_account')}</Label>
                    <p className="text-sm text-muted-foreground">
                        {t('private_account_description')}
                    </p>
                </div>
                <Switch
                    id="private-account"
                    checked={isPrivate}
                    onCheckedChange={(checked) => {
                        setIsPrivate(checked)
                    }}
                    disabled={loading}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="friend-requests">{t('allow_friend_requests')}</Label>
                    <p className="text-sm text-muted-foreground">
                        {t('allow_friend_requests_description')}
                    </p>
                </div>
                <Switch
                    id="friend-requests"
                    checked={allowFriendRequests}
                    onCheckedChange={(checked) => {
                        setAllowFriendRequests(checked)
                             }}
                    disabled={loading}
                />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="show-in-search">{t('discoverable')}</Label>
                    <p className="text-sm text-muted-foreground">
                        {t('discoverable_description')}
                    </p>
                </div>
                <Switch
                    id="show-in-search"
                    checked={showInSearch}
                    onCheckedChange={(checked) => {
                        setShowInSearch(checked)
                    }}
                    disabled={loading}
                />
            </div>
        </div>
    )
}

