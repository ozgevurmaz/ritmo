"use client"

import React, { useState } from 'react'
import { PasswordInput } from '../auth/passwordInput'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

const SecuritySettingsForm = ({ profile }: { profile: UserType }) => {
    const supabase = createClient()
 const [changingPassword, setChangingPassword] = useState(false)
    const passwordForm = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            password: "",
            confirmPassword: "",
        }
    })

    async function onPasswordSubmit(data: ChangePasswordFormData) {
        try {
            setChangingPassword(true)

            // Verify current password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: profile?.email!,
                password: data.currentPassword
            })

            if (signInError) {
                passwordForm.setError('currentPassword', {
                    type: 'manual',
                    message: 'Current password is incorrect'
                })
                return
            }

            // Update password
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            })

            if (error) throw error

            passwordForm.reset()
            toast.success("Password updated successfully!")
        } catch (error: any) {
            toast.error(error.message || "Failed to update password")
        } finally {
            setChangingPassword(false)
        }
    }

    return (
        <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <PasswordInput
                    control={passwordForm.control}
                    name="currentPassword"
                    label="Current Password"
                    disabled={changingPassword}
                />

                <PasswordInput
                    control={passwordForm.control}
                    name="password"
                    confirmName="confirmPassword"
                    requireConfirmation={true}
                    label="New Password"
                    disabled={changingPassword}
                    showValidation={true}
                />

                <Button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full sm:w-auto"
                >

                    Change Password

                </Button>
            </form>
        </Form>
    )
}

export default SecuritySettingsForm