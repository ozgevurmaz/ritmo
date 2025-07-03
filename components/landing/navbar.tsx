import Link from 'next/link'
import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg">R</span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">Ritmo</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                        <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Stories</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link href="/auth" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
                        <Link href="/auth" className="bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-all transform hover:scale-105">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar