"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { passwordSchemas } from "@/lib/zod/auth/auth";
import { PasswordInput } from "@/components/auth/passwordInput";

const resetPasswordSchema = passwordSchemas.withConfirmation();
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validating, setValidating] = useState(true);

    const form = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    // Validate the reset token on component mount
    useEffect(() => {
        const validateToken = async () => {
            const supabase = createClient();

            // Check if we have the necessary URL fragments for password reset
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            const type = hashParams.get('type');

            if (type === 'recovery' && accessToken && refreshToken) {
                // Set the session with the tokens from the URL
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });

                if (error) {
                    setError("Invalid or expired reset link. Please request a new one.");
                }
            } else {
                setError("Invalid reset link. Please request a new password reset.");
            }

            setValidating(false);
        };

        validateToken();
    }, []);

    const onSubmit = async (data: ResetPasswordFormData) => {
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccess(true);
                // Clear the URL hash
                window.history.replaceState(null, '', window.location.pathname);

                setTimeout(() => {
                    router.push("/auth");
                }, 3000);
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Loading state while validating token
    if (validating) {
        return (
            <div className="space-y-4 max-w-md mx-auto mt-10 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p>Validating reset link...</p>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="space-y-4 max-w-sm mx-auto mt-10 text-center">
                <div className="text-green-600 text-4xl mb-4">✓</div>
                <h2 className="text-2xl font-semibold">Password Updated Successfully</h2>
                <Alert>
                    <AlertDescription>
                        Your password has been updated. You will be redirected to the login page shortly.
                    </AlertDescription>
                </Alert>
                <Button onClick={() => router.push("/auth")} className="w-full">
                    Go to Login
                </Button>
            </div>
        );
    }

    // Error state (invalid/expired link)
    if (error && validating === false && !form.formState.isSubmitting) {
        return (
            <div className="space-y-4 max-w-md mx-auto mt-10 text-center">
                <div className="text-red-600 text-4xl mb-4">⚠️</div>
                <h2 className="text-2xl font-semibold">Invalid Reset Link</h2>
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Button onClick={() => router.push("/auth/forgot-password")} className="w-full">
                        Request New Reset Link
                    </Button>
                    <Button onClick={() => router.push("/auth")} variant="outline" className="w-full">
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-center">Set New Password</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <PasswordInput
                        control={form.control}
                        name="password"
                        confirmName="confirmPassword"
                        requireConfirmation={true}
                        label="New Password"
                        disabled={loading}
                        showValidation={true}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Updating Password..." : "Update Password"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
