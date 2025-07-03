"use client"

import { ArrowRight, Check, Zap } from 'lucide-react'
import React, { useState } from 'react'
import { features } from './constants'

const Features = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    return (
        <section id="features" className="p-20 bg-card">

            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                    Everything You Need to Succeed
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Powerful features designed to help you build lasting habits with the support of your community
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className={`p-8 rounded-2xl border transition-all duration-500 cursor-pointer transform hover:scale-105 ${activeFeature === index
                            ? 'bg-primary/10 border-primary shadow-lg'
                            : 'bg-card border-border hover:border-primary/50'
                            }`}
                        onClick={() => setActiveFeature(index)}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors"
                            style={{ backgroundColor: `${feature.color}20`, color: feature.color }}
                        >
                            {<feature.icon className='w-8 h-8' />}
                        </div>
                        <h3 className="text-2xl font-semibold text-foreground mb-4">{feature.title}</h3>
                        <p className="text-muted-foreground text-lg">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Feature Showcase */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-bold text-foreground mb-6">
                            See Your Progress Come to Life
                        </h3>
                        <div className="space-y-4">
                            {['Daily streak tracking', 'Friend activity feed', 'Achievement celebrations', 'Progress analytics'].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-foreground font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-card rounded-2xl p-6 shadow-xl border border-border">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-foreground">Today's Things</h4>
                                <div className="text-sm text-muted-foreground">3/4 completed</div>
                            </div>
                            <div className="space-y-3">
                                {[
                                    { name: "Morning meditation", completed: true, streak: 12 },
                                    { name: "Read 30 minutes", completed: true, streak: 8 },
                                    { name: "Exercise", completed: true, streak: 5 },
                                    { name: "Journal writing", completed: false, streak: 3 }
                                ].map((habit, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full ${habit.completed ? 'bg-success' : 'bg-muted'}`} />
                                            <span className={habit.completed ? 'text-foreground' : 'text-muted-foreground'}>
                                                {habit.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-muted-foreground">{habit.streak} day streak</span>
                                            <Zap className="w-4 h-4 text-secondary" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-7 text-white max-w-4xl mx-auto text-center mt-20">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Start Your Journey?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    Join thousands of people who are building better habits together
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </section>
    )
}

export default Features