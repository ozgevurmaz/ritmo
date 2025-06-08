'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingScreen from '../shared/pageStyles/Loading'

// Zod schema for verification code
const verifyEmailSchema = z.object({
    code: z.string()
        .min(6, 'Verification code must be 6 characters')
        .max(6, 'Verification code must be 6 characters')
        .regex(/^\d{6}$/, 'Verification code must contain only numbers')
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

interface VerifyEmailPageProps {
    email?: string
}

export default function VerifyEmailPage({ email }: VerifyEmailPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isResending, setIsResending] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)
    const [resendCooldown, setResendCooldown] = useState<number>(0)

    console.log(email)
    // Get email from props or URL params
    const userEmail = email || searchParams.get('email') || ''

    const form = useForm<VerifyEmailFormData>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: {
            code: '',
        },
    })

    // Cooldown timer for resend button
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (resendCooldown > 0) {
            interval = setInterval(() => {
                setResendCooldown(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [resendCooldown])

    const onSubmit = async (data: VerifyEmailFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            // Replace with your actual verification action
            const formData = new FormData()
            formData.append('email', userEmail)
            formData.append('code', data.code)

            // const result = await verifyEmail(formData)
            
            // Simulate API call for now
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            // Mock success/error handling
            const mockSuccess = Math.random() > 0.3 // 70% success rate for demo
            
            if (mockSuccess) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/auth/login?verified=true')
                }, 2000)
            } else {
                setError('Invalid verification code. Please try again.')
            }

            // Uncomment and modify based on your actual implementation:
            // if (result?.error) {
            //     setError(result.error)
            // } else {
            //     setSuccess(true)
            //     setTimeout(() => {
            //         router.push('/auth/login?verified=true')
            //     }, 2000)
            // }
        } catch (error: any) {
            setError(error.message || 'An error occurred during verification')
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (resendCooldown > 0) return

        setIsResending(true)
        setError(null)

        try {
            // Replace with your actual resend action
            const formData = new FormData()
            formData.append('email', userEmail)

            // const result = await resendVerificationEmail(formData)
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            setResendCooldown(60) // 60 second cooldown
            
            // Uncomment and modify based on your actual implementation:
            // if (result?.error) {
            //     setError(result.error)
            // } else {
            //     setResendCooldown(60)
            // }
        } catch (error: any) {
            setError(error.message || 'Failed to resend verification code')
        } finally {
            setIsResending(false)
        }
    }

    if (isLoading && success) return <LoadingScreen />

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    {success ? (
                        <CheckCircle className="h-12 w-12 text-success" />
                    ) : (
                        <Mail className="h-12 w-12 text-primary" />
                    )}
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                    {success ? 'Email Verified!' : 'Verify Your Email'}
                </h1>
                <p className="text-muted-foreground">
                    {success 
                        ? 'Your email has been successfully verified. Redirecting to login...'
                        : `Verify your mail address in ${userEmail ? userEmail : 'your email'}`
                    }
                </p>
            </div>

            {/* Resend Section */}
            {!success && (
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the code?
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleResendCode}
                        disabled={isResending || resendCooldown > 0}
                    >
                        {isResending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : resendCooldown > 0 ? (
                            `Resend code in ${resendCooldown}s`
                        ) : (
                            'Resend verification code'
                        )}
                    </Button>
                </div>
            )}

            {/* Footer Links */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
                <div>
                    <Link href="/auth/login" className="text-blue-700 hover:underline">
                        Back to Login
                    </Link>
                </div>
                <div>
                    Need help?{' '}
                    <Link href="/support" className="text-blue-700 hover:underline">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    )
}