'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import SignOutButton from '../auth/signoutButton'
import { LogOutIcon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { DeleteConfirmDialog } from '../shared/DeleteConfirmDialog'

interface AccountDangerZoneProps {
    profile: UserType
}

export const AccountDangerZone = ({ profile }: AccountDangerZoneProps) => {
    const t = useTranslations("account.danger")
    const [loading, setLoading] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    return (
        <div className="space-y-4">
            {/* Logout Button */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                    <LogOutIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                        <p className="font-medium">{t('logout')}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('logout_description')}
                        </p>
                    </div>
                </div>
                <SignOutButton />
            </div>

            {/* Delete Account Button */}
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div className="flex items-center gap-3">
                    <TrashIcon className="w-5 h-5 text-destructive" />
                    <div>
                        <p className="font-medium text-destructive">{t('delete_account')}</p>
                        <p className="text-sm text-muted-foreground">
                            {t('delete_account_description')}
                        </p>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={loading}
                >
                    {t('delete')}
                </Button>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                open={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={() => { }}
                title={t('confirm_delete_title')}
                description={t('confirm_delete_description')}
            />
        </div>
    )
}