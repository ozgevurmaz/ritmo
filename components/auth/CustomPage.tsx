'use client'
import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

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
    const t = useTranslations()
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
                {header && <h4 className="text-2xl font-bold text-foreground">
                    {header}
                </h4>}
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
                        {t("buttons.to-login")}
                    </Link>
                </div>
                <div>
                    {t("support.help")} {"  "}
                    <Link href="/support" className="text-secondary hover:underline">
                        {t("support.contact")}
                    </Link>
                </div>
            </div>
        </div>
    )
}