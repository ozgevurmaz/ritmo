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

type ExtendedPostgrestError = PostgrestError & {
  constraint_name?: string
}

const profileSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required.")
    .max(100, "Full name must be less than 100 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      username: "",
    }
  })

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        form.reset({
          full_name: data.full_name || '',
          username: data.username || '',
        })
      }
    } catch (error) {
      toast.error("Failed to load user data. Please try again.")
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
        full_name: data.full_name,
        username: data.username,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      toast.success("Profile updated successfully!")
    } catch (error) {
      let errorMessage = "Failed to update profile. Please try again."

      const extendedError = error as ExtendedPostgrestError

      if (extendedError?.code === '23505') {
        if (extendedError.constraint_name?.includes('username')) {
          form.setError('username', {
            type: 'manual',
            message: 'This username is already taken'
          })
          return
        }
      }

      toast.error(errorMessage)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your account information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  className="bg-gray-50"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Your email address cannot be changed
                </p>
              </div>

              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
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
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your username'
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
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </div>
            </form>
          </Form>



          <div>
            <form action="/auth/signout" method="post">
              <Button
                type="submit"
                variant="outline"
                className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}