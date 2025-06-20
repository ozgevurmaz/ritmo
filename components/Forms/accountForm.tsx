'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { PostgrestError, type User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Label } from '../ui/label'
import { profileSchema } from '@/lib/zod/client/profile'
import SignOut from '@/components/auth/signoutButton'
import LoadingScreen from '../shared/pageStyles/Loading'
import { useTranslations } from 'next-intl'

type ExtendedPostgrestError = PostgrestError & {
  constraint_name?: string
}
type ProfileFormData = z.infer<typeof profileSchema>

export default function AccountForm({ user }: { user: User | null }) {
  const t = useTranslations()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: user?.email,
      username: "",
    }
  })

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`name, surname, username, email, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        form.reset({
          name: data.name || '',
          surname: data.surname || '',
          email: user?.email,
          username: data.username || '',
        })
      }
    } catch (error) {
      toast.error(t("account.toast.user-error"))
    } finally {
      setLoading(false)
    }
  }, [user, supabase, toast, form])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function onSubmit(data: ProfileFormData) {

    try {
      setUpdating(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id as string,
        email: user?.email,
        name: data.name,
        surname: data.surname,
        username: data.username,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success(t("account.toast.success"))
    } catch (error) {
      let errorMessage = t("account.toasts.update.error")

      const extendedError = error as ExtendedPostgrestError

      if (extendedError?.code === '23505') {
        if (extendedError.constraint_name?.includes('username')) {
          form.setError('username', {
            type: 'manual',
            message: t("account.toasts.username-error")
          })
          return
        }
      }

      toast.error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingScreen />

  return (
    <div className="mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("account.title")}</CardTitle>
          <CardDescription>
            {t("account.description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("forms.email.label")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.user_metadata.email}
                  className="bg-muted"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {t("forms.email.account-description")}
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("forms.name.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("forms.name.placeholder")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("forms.surname.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("forms.surname.placeholder")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("forms.username.label")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("forms.username.placeholder")}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
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
                      {t("buttons.updating")}...
                    </>
                  ) : (
                    t("buttons.update")
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div>
            <SignOut />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}