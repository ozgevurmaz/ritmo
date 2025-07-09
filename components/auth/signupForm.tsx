'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { PasswordInput } from '@/components/auth/passwordInput'
import { signupSchema } from '@/lib/zod/auth/auth'
import LoadingScreen from '../shared/pageStyles/Loading'
import { useTranslations } from 'next-intl'
import { InputElement } from '../Forms/Inputs/inputElement'

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
    const t = useTranslations()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        }
    })

    const onSignupSubmit = async (data: SignupFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)
            formData.append('confirmPassword', data.confirmPassword)

            const result = await signup(formData)

            if (result?.error) {
                setError(result.error)
            }
        } catch (error: any) {
            setError(error.message || t("auth.signup-error"))
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <LoadingScreen />

    return (
        <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4" noValidate>
                <InputElement
                    control={signupForm.control}
                    errors={signupForm.formState.errors}
                    name="email"
                    label={t("forms.email.label")}
                    placeholder={t("forms.email.placeholder")}
                    type="email"
                />
                <PasswordInput
                    control={signupForm.control}
                    name="password"
                    confirmName="confirmPassword"
                    requireConfirmation={true}
                    disabled={isLoading}
                    showValidation={true}
                    label={t("forms.password.label")}
                />

                <Button
                    type="submit"
                    className="w-full font-semibold "
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("auth.signup.creating")}
                        </>
                    ) : (
                        t("buttons.signup")
                    )}
                </Button>

                {error && (
                    <div className="text-accent text-sm">
                        {error}
                    </div>
                )}
            </form>
        </Form>
    )
}