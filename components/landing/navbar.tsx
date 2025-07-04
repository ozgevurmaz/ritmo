import { Zap } from 'lucide-react'
import React from 'react'
import { Link } from '../ui/link';

type Props = {
    showLinks?: boolean;
}

const Navbar = ({ showLinks = true }: Props) => {
    return (
        <nav className="fixed top-0 w-full h-18 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link variant="brand" href="/" className="flex items-center space-x-2">
                        <div className="w-9 h-9 p-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-lg"><Zap className='w-8 h-8' /></span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">Ritmo</span>
                    </Link>

                    {showLinks &&
                        <div className="flex items-center space-x-4">
                            <Link variant="ctalink" href="/auth" >Sign In</Link>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
}

export default Navbar