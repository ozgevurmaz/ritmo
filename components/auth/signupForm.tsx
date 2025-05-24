'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, Mail, Lock } from 'lucide-react'

const signupSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

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
        },
    })

    const onSignupSubmit = async (data: SignupFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)

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
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} noValidate className="space-y-4">
                <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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

                <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="Create a strong password"
                                        className="pl-10"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                            <p className="text-xs text-gray-500">
                                Must be 8+ characters with uppercase, lowercase, and number
                            </p>
                        </FormItem>
                    )}
                />

                <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="Confirm your password"
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

                <Button
                    type="submit"
                    className="w-full"
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
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}
            </form>
        </Form>
    )
}