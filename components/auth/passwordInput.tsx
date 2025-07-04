"use client";

import { useState, useEffect } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface PasswordValidation {
  minLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumber: boolean;
}

interface PasswordInputProps<T extends FieldValues> {
  // React Hook Form integration
  control: Control<T>;
  name: FieldPath<T>;
  confirmName?: FieldPath<T>;

  // Configuration
  requireConfirmation?: boolean;
  showValidation?: boolean;
  label: string;
  disabled?: boolean;
}

const ValidationItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <div className={`flex items-center space-x-2 text-sm ${isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
    {isValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
    <span>{text}</span>
  </div>
);



export function PasswordInput<T extends FieldValues>({
  control,
  name,
  confirmName,
  requireConfirmation = false,
  showValidation = false,
  label,
  disabled = false,
}: PasswordInputProps<T>) {
  const t = useTranslations("forms.password")
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });

  return (
    <div className="space-y-4">
      {/* Password Field */}
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          // Update validation when password changes
          useEffect(() => {
            if (showValidation) {
              setPasswordValidation({
                minLength: field.value?.length >= 8,
                hasUpperCase: /[A-Z]/.test(field.value || ''),
                hasLowerCase: /[a-z]/.test(field.value || ''),
                hasNumber: /\d/.test(field.value || ''),
              });
            }
          }, [field.value]);

          return (
            <FormItem>
              <FormLabel htmlFor={name}>{label}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id={name}
                    type={showPassword ? "text" : "password"}
                    placeholder={`${requireConfirmation ? t("new-placeholder") : t("placeholder")}`}
                    disabled={disabled}
                    className="pr-10"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={disabled}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Password Requirements */}
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <>
            {field.value && showValidation && (
              <div className="space-y-2 p-3 bg-muted rounded-md text-muted-foreground">
                <p className="text-sm font-medium text-secondary">{t("validation.requirments")}:</p>
                <ValidationItem isValid={passwordValidation.minLength} text={t("validation.length")} />
                <ValidationItem isValid={passwordValidation.hasUpperCase} text={t("validation.uppercase")} />
                <ValidationItem isValid={passwordValidation.hasLowerCase} text={t("validation.lowercase")} />
                <ValidationItem isValid={passwordValidation.hasNumber} text={t("validation.number")} />
              </div>
            )}
          </>
        )}
      />

      {/* Confirm Password Field */}
      {requireConfirmation && confirmName && (
        <FormField
          control={control}
          name={confirmName}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirm-pass">{t("confirm-label")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="confirm-pass"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirm-placeholder")}
                    disabled={disabled}
                    className="pr-10 bg-background"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={disabled}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}