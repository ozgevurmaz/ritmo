import { Coffee, Heart, Zap } from 'lucide-react'
import React from 'react'
import { Link } from '../ui/link'

const Footer = () => {
    return (
        <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="w-9 h-9 p-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg"><Zap className='w-8 h-8' /></span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">Ritmo</span>
                    </div>

                    <div className="flex items-center space-x-6 text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                    </div>
                </div>

                <div className="text-center mt-8 text-muted-foreground">
                    <p>
                        &copy; 2025 Ritmo. Made with 
                        <Heart fill="red" className="w-4 h-4 text-destructive inline mx-1" />  
                        &
                        <Coffee fill='brown' className="w-4 h-4 text-orange-900 inline mx-1" />
                        for habit builders.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer