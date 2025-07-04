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
import { useTranslations } from "next-intl";

const resetPasswordSchema = passwordSchemas.withConfirmation();
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const t = useTranslations()
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
                setError(t("auth.reset-password.error.missing-link"));
                setValidating(false);
                return;
            }

            const session = await supabase.auth.getSession();
            if (error) {
                setError(t("auth.reset-password.error.invalid-link"));
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
            <LoadingScreen customMessage={t("auth.reset-password.loading")} />
        );
    }

    if (success) {
        return (
            <div className="space-y-4 max-w-sm mx-auto mt-10 text-center">
                <div className="text-primary text-4xl mb-4">✓</div>
                <h4 className="text-2xl font-semibold">{t("auth.reset-password.success.title")} </h4>
                <Alert>
                    <AlertDescription>
                        {t("auth.reset-password.success.description")}
                    </AlertDescription>
                </Alert>
                <Button onClick={() => router.push("/auth")} className="w-full">
                    {t("buttons.to-login")}
                </Button>
            </div>
        );
    }

    if (error && validating === false && !form.formState.isSubmitting) {
        return (
            <div className="space-y-4 max-w-md mx-auto mt-10 text-center">
                <TriangleAlert className="w-12 h-12 mx-auto mb-6 text-destructive" />
                <h2 className="text-2xl font-semibold">{t("auth.reset-password.error.title")}</h2>
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="space-y-2">
                    <Button onClick={() => router.push("/auth/forgot-password")} className="w-full">
                        {t("buttons.send-another")}
                    </Button>
                    <Button onClick={() => router.push("/auth")} variant="outline" className="w-full">
                        {t("buttons.to-login")}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-md mx-auto mt-10">
            <h2 className="text-2xl font-semibold text-center">{t("auth.reset-password.title")}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <PasswordInput
                        control={form.control}
                        name="password"
                        confirmName="confirmPassword"
                        requireConfirmation={true}
                        label={t("auth.reset-password.label")}
                        disabled={loading}
                        showValidation={true}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? t("auth.reset-password.updating") : t("buttons.update")}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
