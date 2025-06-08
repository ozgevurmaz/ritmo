'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Loader2, Mail, CheckCircle, AlertCircle, LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import LoadingScreen from '../shared/pageStyles/Loading'

interface CustomPagePageProps {
    email?: string
    icon?: LucideIcon
    header?: string
    description?: string
    button?: boolean
    buttonDescription?: string
    buttonText?: string
    buttonAction?: () => void
}

export default function CustomPage({ email, icon, header, description, button, buttonAction, buttonDescription, buttonText }: CustomPagePageProps) {

    const Icon = icon;

    return (
        <div className="space-y-6 mt-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="flex justify-center">
                    {Icon && (
                        <Icon className="h-12 w-12 text-primary" />
                    )}
                </div>
                {header && <h1 className="text-2xl font-bold text-foreground">
                    {header}
                </h1>}
                {description && <p className="text-muted-foreground">
                    {description}
                </p>}
            </div>

            {/* Resend Section */}
            {button &&
                <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                        {buttonDescription}
                    </p>
                    <Button
                        variant="outline"
                        onClick={buttonAction}
                    >
                        {buttonText}
                    </Button>
                </div>
            }

            {/* Footer Links */}
            <div className="text-center text-sm text-muted-foreground space-y-2">
                <div>
                    <Link href="/auth" className="text-secondary hover:underline">
                        Back to Login
                    </Link>
                </div>
                <div>
                    Need help? {"  "}
                    <Link href="/support" className="text-secondary hover:underline">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    )
}