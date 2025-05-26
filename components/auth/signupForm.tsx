'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, Mail } from 'lucide-react'
import { PasswordInput } from '@/components/auth/passwordInput'
import { signupSchema } from '@/lib/zod/auth/auth'

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
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

            // Handle signup result if your action returns error info
            if (result?.error) {
                setError(result.error)
            }
        } catch (error: any) {
            setError(error.message || 'An error occurred during signup')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4" noValidate>
                <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground" />
                                    <Input
                                        type="email"
                                        autoComplete='none'
                                        placeholder="Enter your email"
                                        className="pl-10"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Replace the individual password fields with the PasswordInput component */}
                <PasswordInput
                    control={signupForm.control}
                    name="password"
                    confirmName="confirmPassword"
                    requireConfirmation={true}
                    disabled={isLoading}
                    showValidation={true}
                />

                <Button
                    type="submit"
                    className="w-full font-semibold "
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
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