'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form } from '@/components/ui/form'
import { Camera, Loader2, UserIcon } from 'lucide-react'
import { toast } from 'sonner'
import { InputElement } from '../Forms/Inputs/inputElement'
import { profileSchema } from '@/lib/zod/client/profile'
import { useState } from 'react'
import { Label } from '../ui/label'
import ProfilePhoto from '../shared/profilePhoto'
import { useTranslations } from 'next-intl'

type ProfileFormData = z.infer<typeof profileSchema>

type AccountSettingFormProps = {
    profile: UserType;
}

export default function AccountSettingForm({ profile }: AccountSettingFormProps) {
    const t = useTranslations()
    const supabase = createClient()
    const [updating, setUpdating] = useState(false)

    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            surname: "",
            email: profile?.email,
            username: "",
        }
    })

    async function onSubmit(data: ProfileFormData) {
        try {
            setUpdating(true)

            const { error } = await supabase.from('profiles').upsert({
                id: profile?.id as string,
                email: profile?.email,
                name: data.name,
                surname: data.surname,
                username: data.username,
                updated_at: new Date().toISOString(),
            })

            if (error) throw error

            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error("An error occurred while updating the profile")
        } finally {
            setUpdating(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <ProfilePhoto profile={profile} size="lg" />
                            <label
                                htmlFor="avatar-upload"
                                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                            >
                                {uploadingAvatar ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Camera className="w-4 h-4" />
                                )}
                            </label>
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={() => { }}
                                className="hidden"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-sm">{t("account.profile.profile-picture")}</p>
                            <p className="text-xs text-muted-foreground">
                                {t("account.profile.profile-picture-description")}
                            </p>
                        </div>
                    </div>

                    <Label htmlFor="email">{t("forms.email.label")}</Label>
                    <Input
                        id="email"
                        type="email"
                        value={profile?.email}
                        className="bg-muted"
                        disabled
                    />
                    <p className="text-xs text-muted-foreground">
                        {t("account.profile.email-description")}
                    </p>
                </div>

                <InputElement
                    control={form.control}
                    errors={form.formState.errors}
                    name="name"
                    label={t("forms.name.label")}
                    placeholder={t("forms.name.placeholder")}
                />

                <InputElement
                    control={form.control}
                    errors={form.formState.errors}
                    name="surname"
                    label={t("forms.surname.label")}
                    placeholder={t("forms.surname.placeholder")}
                />

                <InputElement
                    control={form.control}
                    errors={form.formState.errors}
                    name="username"
                    label={t("forms.username.label")}
                    placeholder={t("forms.username.placeholder")}
                />

                <div className="flex justify-between items-center pt-4">
                    <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="w-full sm:w-auto"
                    >
                        {form.formState.isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t("buttons.updating")}
                            </>
                        ) : (
                            <>{t("buttons.update")}</>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
