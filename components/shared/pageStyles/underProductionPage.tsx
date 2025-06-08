'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Construction, Clock, ArrowLeft, Hammer, Zap, Users } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UnderProductionPageProps {
    title?: string
    message?: string
    estimatedTime?: string
    showBackButton?: boolean
    backUrl?: string
}

export default function UnderProductionPage({
    title = "Under Development",
    message = "We're working hard to bring you this feature!",
    estimatedTime = "Coming Soon",
    showBackButton = true,
    backUrl = "/",
}: UnderProductionPageProps) {
    const router = useRouter()
    const [dots, setDots] = useState('')

    // Animated dots for loading effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev === '...') return ''
                return prev + '.'
            })
        }, 500)

        return () => clearInterval(interval)
    }, [])

    const handleGoBack = () => {
        if (backUrl === 'back') {
            router.back()
        } else {
            router.push(backUrl)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full space-y-8 text-center">
                {/* Animated Construction Icon */}
                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Construction className="h-24 w-24 text-primary animate-pulse" />
                            <div className="absolute -top-2 -right-2">
                                <Hammer className="h-8 w-8 text-accent animate-bounce" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold text-foreground">
                        {title}
                    </h1>

                    <p className="text-lg text-muted-foreground">
                        {message}
                    </p>

                    {/* Loading Animation */}
                    <div className="flex items-center justify-center gap-2 text-primary">
                        <Zap className="h-5 w-5" />
                        <span className="font-medium">Building amazing features{dots}</span>
                    </div>
                </div>

                {/* Estimated Time */}
                <div className="bg-accent border border-border rounded-lg p-4">
                    <div className="flex items-center justify-center text-accent-foreground gap-2 mb-2">
                        <Clock className="h-5 w-5" />
                        <span className="font-semibold">Timeline</span>
                    </div>
                    <p className="text-foreground font-medium">{estimatedTime}</p>
                </div>

                {/* Progress Bar Animation */}
                <div className=" mx-auto">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-[fillBar_8s_ease-in-out_infinite]"></div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    {showBackButton && (
                        <Button
                            onClick={handleGoBack}
                            variant="ghost"
                            className="w-full font-semibold"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            {backUrl === 'back' ? 'Go Back' : 'Return Home'}
                        </Button>
                    )}
                </div>

                {/* Footer Links */}
                <div className="text-center text-sm text-muted-foreground space-y-2 pt-4 border-t border-border">
                    <p>Stay updated on our progress</p>
                    <div className="flex justify-center gap-4">
                        <Link href="/updates" className="text-secondary hover:underline">
                            Development Updates
                        </Link>
                        <Link href="/support" className="text-secondary hover:underline">
                            Contact Support
                        </Link>
                    </div>
                </div>

                {/* Ritmo Branding */}
                <div className="text-center pt-4">
                    <p className="text-xs text-muted-foreground">
                        Building the future of habit tracking with{' '}
                        <span className="text-primary font-semibold">Ritmo</span>
                    </p>
                </div>
            </div>
        </div>
    )
}