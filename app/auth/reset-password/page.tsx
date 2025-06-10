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
import { TriangleAlert } from "lucide-react";
import LoadingScreen from "@/components/shared/pageStyles/Loading";

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

    useEffect(() => {
        const exchangeCode = async () => {
            const supabase = createClient();
            const code = new URLSearchParams(window.location.search).get("code");

            if (!code) {
                setError("Reset link is missing.");
                setValidating(false);
                return;
            }

            const session = await supabase.auth.getSession();
            if (error) {
                setError("Invalid or expired reset link.");
            }

            setValidating(false);
        };

        exchangeCode();
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
                setTimeout(() => {
                    router.push("/auth");
                }, 3000);
            }
        } catch (err) {
            setError("Unexpected error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (validating) {
        return (
            <LoadingScreen customMessage="Validating reset link..." />
        );
    }

    // Success state
    if (success) {
        return (
            <div className="space-y-4 max-w-sm mx-auto mt-10 text-center">
                <div className="text-primary text-4xl mb-4">✓</div>
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
                <TriangleAlert className="w-12 h-12 mx-auto mb-6 text-destructive" />
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
