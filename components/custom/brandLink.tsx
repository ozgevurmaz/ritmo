import { Zap, Sparkles } from 'lucide-react'
import React from 'react'
import { Link } from '../ui/link'

const BrandLink = ({ isAdmin = false, href }: { isAdmin: boolean, href: string }) => {
    return (
        <Link variant="brand" href={href}>
            <div className="relative">
                <Zap className="h-7 w-7 text-primary transition-colors duration-300" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm opacity-0"></div>
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Ritmo
                {isAdmin && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground text-xs font-bold rounded-full">
                        <Sparkles className="h-3 w-3" />
                        Admin
                    </span>
                )}
            </span>
        </Link>
    )
}

export default BrandLink