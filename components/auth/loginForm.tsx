'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { login } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Loader2, } from 'lucide-react'

import Link from 'next/link'
import { loginSchema } from '@/lib/zod/auth/auth'
import { PasswordInput } from './passwordInput'
import LoadingScreen from '../shared/pageStyles/Loading'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { InputElement } from '../Forms/Inputs/inputElement'

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
    const t = useTranslations();
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)

            const result = await login(formData)

            if (result?.error) {
                setError(result.error)
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred during login')
        } finally {
            setIsLoading(false)
        }
        router.push("/")
    }
    if (isLoading) return <LoadingScreen />

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-foreground" noValidate>
                <InputElement
                    control={form.control}
                    errors={form.formState.errors}
                    name="email"
                    label={t("forms.email.label")}
                    placeholder={t("forms.email.placeholder")}
                    type="email"
                />

                <div className="space-y-2">
                    <PasswordInput
                        control={form.control}
                        name="password"
                        disabled={isLoading}
                        label={t("forms.password.label")}

                    />

                    <div className="text-right">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-secondary hover:underline"
                        >
                            {t("auth.forgot-password.title")}
                        </Link>
                    </div>
                </div>

                <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("buttons.signing-in")}
                        </>
                    ) : (
                        `${t("buttons.signin")}`
                    )}
                </Button>

                {error && (
                    <div className="text-accent text-sm">
                        {error}
                    </div>
                )}
            </form>

            <div className="text-center text-sm text-muted-foreground">
                {t("auth.login.ask-account")}{' '}
                <Link href="/auth/signup" className="text-secondary hover:underline">
                    {t("auth.signup.title")}
                </Link>
            </div>
        </Form>
    )
}