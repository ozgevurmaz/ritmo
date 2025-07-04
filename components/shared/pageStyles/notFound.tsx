"use client"

import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft, Target, Calendar, Users, RefreshCw, Zap } from 'lucide-react';
import Navbar from '@/components/landing/navbar';
import { Link } from '@/components/ui/link';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
    const router = useRouter();

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    const handleGoBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        router.back();
    };
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <Navbar showLinks={false} />
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-2xl mx-auto mt-16 text-center">
                {/* Logo */}

                {/* 404 Animation */}
                <div className="text-4xl md:text-6xl font-bold mb-4">
                    404
                </div>

                {/* Main Content */}
                <div className={`mb-12 transition-all duration-1000 delay-400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                        Looks like you've wandered off your habit path. Don't worry, even the best streaks have detours!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-800 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <Link
                        href='/'
                        variant="ctalink"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>

                    <Link
                        href='#'
                        variant="ctalink"
                        className='bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors'
                        onClick={handleGoBack}
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Link>
                </div>

                {/* Search Suggestion */}
                <div className={`mt-12 transition-all duration-1000 delay-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 border border-border max-w-md mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <Search className="w-5 h-5 text-muted-foreground" />
                            <span className="text-foreground font-medium">Looking for something specific?</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Search habits, goals, or friends..."
                                className="flex-1 px-4 py-2 bg-background border border-input-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Fun Motivational Quote */}
                <div className={`mt-12 transition-all duration-1000 delay-1200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="text-center">
                        <p className="text-muted-foreground italic">
                            "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            - Robin Sharma
                        </p>
                    </div>
                </div>

                {/* Error Code for Debugging */}
                <div className={`mt-8 transition-all duration-1000 delay-1400 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <details className="text-left max-w-md mx-auto">
                        <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                            Error Details
                        </summary>
                        <div className="mt-2 p-4 bg-card/30 rounded-lg border border-border text-sm">
                            <div className="space-y-2 text-muted-foreground">
                                <div>Error Code: 404</div>
                                <div>Timestamp: {new Date().toISOString()}</div>
                                <div>Path: {window.location.pathname}</div>
                                <div>User Agent: {navigator.userAgent.slice(0, 50)}...</div>
                            </div>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;