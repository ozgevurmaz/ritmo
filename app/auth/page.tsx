'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import LoginForm from '@/components/auth/loginForm'
import { SignupForm } from '@/components/auth/signupForm'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
    const t = useTranslations('auth');

    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState('login')

    const handleTabChange = (value: string) => {
        setActiveTab(value)
        setError(null)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 h-14">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">{t('welcome')}</CardTitle>
                    <CardDescription className="text-center">
                        {t("description")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">{t("login.title")}</TabsTrigger>
                            <TabsTrigger value="signup">{t("signup.title")}</TabsTrigger>
                        </TabsList>

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Login Tab */}
                        <TabsContent value="login" className="space-y-4 mt-4">
                            <LoginForm />
                        </TabsContent>

                        {/* Signup Tab */}
                        <TabsContent value="signup" className="space-y-4 mt-4">
                            <SignupForm />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}