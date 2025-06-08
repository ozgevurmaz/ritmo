"use client"

import CustomPage from '@/components/auth/CustomPage'
import LoadingScreen from '@/components/shared/pageStyles/Loading'
import { useUser } from '@/context/auth-context'
import { createClient } from '@/lib/supabase/client'
import { Mail, X } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const Page = () => {
    const { user, loading } = useUser()

    if (loading) return <LoadingScreen />

    if (!user?.email) {
        return (
            <CustomPage
                header="User cannot be found"
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
            toast.success("Verification mail sent");
        } else {
            toast.error(error.message);
        }
    };


    return (
        <CustomPage
            icon={Mail}
            header="Verify Your Email"
            description={`Verify your mail address in ${user?.email ?? 'your email'}`}
            button
            buttonDescription="Didn't receive the code?"
            buttonText="Resend verification code"
            buttonAction={handleResend}
        />
    )
}

export default Page
