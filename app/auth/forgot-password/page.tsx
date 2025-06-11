"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { forgotPasswordSchema } from "@/lib/zod/auth/auth";
import { resetPasswordForEmail } from "@/actions/auth";
import { useTranslations } from "next-intl";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations()

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError("");

    try {

      const formData = new FormData();
      formData.append('email', data.email);

      const result = await resetPasswordForEmail(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(t("error.unexpected"));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4 max-w-md mx-auto mt-10">
        <div className="text-center">
          <Mail className="w-12 h-12 mx-auto mb-6 text-destructive" />
          <h2 className="text-2xl font-semibold mb-2">{t("auth.forgot-password.success.title")}</h2>
          <p className="text-foreground mb-6">
            {t("auth.forgot-password.success.description")}
          </p>
        </div>

        <Alert>
          <AlertDescription>
            {t("auth.forgot-password.success.description2")}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col space-y-2">
          <Button onClick={() => setSuccess(false)} variant="outline" className="w-full">
            {t("auth.forgot-password.send-link")}
          </Button>
          <Link href="/auth" className="w-full">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("buttons.to-login")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto mt-10">
      <div className="text-center">
        <Mail className="w-12 h-12 mx-auto mb-6 text-destructive" />
        <h2 className="text-2xl font-semibold">{t("auth.forgot-password.title")}</h2>
        <p className="text-foreground mt-2">
          {t("auth.forgot-password.description")}
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("forms.email.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder={t("forms.email.placeholder")}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {t("buttons.send-link")}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link href="/auth" className="text-sm text-secondary hover:underline flex justify-center items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t("buttons.to-login")}
        </Link>
      </div>
    </div>
  );
}