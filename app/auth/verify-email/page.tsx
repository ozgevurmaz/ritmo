"use client"

import CustomPage from '@/components/auth/CustomPage'
import LoadingScreen from '@/components/shared/pageStyles/Loading'
import { useUser } from '@/context/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Mail, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { toast } from 'sonner'

const Page = () => {
    const t = useTranslations()
    const { user, loading } = useUser()

    if (loading) return <LoadingScreen />

    if (!user?.email) {
        return (
            <CustomPage
                header={t("errors.user-error")}
                icon={X}
            />
        );
    }

    const handleResend = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: user.email!,
        });

        if (!error) {
            toast.success(t("auth.verification.success"));
        } else {
            toast.error(error.message);
        }
    };


    return (
        <CustomPage
            icon={Mail}
            header={t("auth.verification.title")}
            description={`${t("auth.verification.description")} ${user.email}`}
            button
            buttonDescription={t("auth.verification.no-code")}
            buttonText={t("buttons.send-another")}
            buttonAction={handleResend}
        />
    )
}

export default Page
