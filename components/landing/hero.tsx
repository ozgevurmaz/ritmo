"use client"

import { ArrowRight } from 'lucide-react'
import { Link } from '../ui/link'

const Hero = () => {
    return (
        <section className="h-screen mt-14 text-center flex flex-col items-center justify-center gap-8">

            <h1 className="text-5xl md:text-7xl font-bold text-foreground py-2 leading-tight">
                Build Better
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                    Habits Together
                </span>
            </h1>
            <p
                className="text-lg text-muted-foreground max-w-4xl mb-4 mx-auto leading-relaxed"
            >
                Transform your goals into lasting habits with friends by your side.
                Track progress, celebrate wins, and stay motivated with social accountability.
            </p>
            <Link
                href="/auth"
                variant="ctalink"
            >
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
            </Link>
        </section>
    )
}

export default Hero