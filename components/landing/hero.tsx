"use client"

import { ArrowRight } from 'lucide-react'
import { Link } from '../ui/link'
import { useEffect, useState } from 'react'

const Hero = () => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="h-screen text-center gap-6 relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            
            <div className="relative z-10 flex flex-col items-center justify-center gap-8 h-full">
                {/* Main heading with staggered animation */}
                <h1 className={`text-5xl md:text-7xl font-bold text-foreground leading-tight transition-all duration-1000 ease-out ${
                    isVisible 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-8'
                }`}>
                    <span className={`block transition-all  p-2 duration-1000 ease-out ${
                        isVisible 
                            ? 'opacity-100 transform translate-y-0' 
                            : 'opacity-0 transform translate-y-8'
                    }`}>
                        Build Better
                    </span>
                    <span className={`bg-gradient-to-r p-2 from-primary via-secondary to-accent bg-clip-text text-transparent block transition-all duration-1000 ease-out hover:scale-105 transform ${
                        isVisible 
                            ? 'opacity-100 translate-y-0' 
                            : 'opacity-0 translate-y-8'
                    }`} 
                    style={{ transitionDelay: '0.2s' }}>
                        Habits Together
                    </span>
                </h1>

                {/* Description with fade-in animation */}
                <p className={`text-lg text-muted-foreground max-w-2xl mb-5 mx-auto leading-relaxed transition-all duration-1000 ease-out ${
                    isVisible 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '0.4s' }}>
                    Transform your goals into lasting habits with friends by your side.
                    Track progress, celebrate wins, and stay motivated with social accountability.
                </p>

                {/* CTA button with enhanced animations */}
                <div className={`transition-all duration-1000 ease-out ${
                    isVisible 
                        ? 'opacity-100 transform translate-y-0' 
                        : 'opacity-0 transform translate-y-8'
                }`}
                style={{ transitionDelay: '0.6s' }}>
                    <Link
                        href="/auth"
                        variant="ctalink"
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0"
                    >
                        <span className="relative z-10">Start Your Journey</span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        
                        {/* Animated background on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-hover to-accent-hover rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Ripple effect on click */}
                        <div className="absolute inset-0 rounded-full bg-muted-foreground scale-0 group-active:scale-100 transition-transform duration-200" />
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '0.8s' }}>
                <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-bounce" />
                </div>
            </div>
        </section>
    )
}

export default Hero