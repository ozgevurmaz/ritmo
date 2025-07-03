"use client"

import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, Star, PlayCircle, Check, ArrowRight } from 'lucide-react';
import { features, testimonials } from '@/components/landing/constants';
import Navbar from '@/components/landing/navbar';

const RitmoLanding = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                Build Better
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">
                  Habits Together
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Transform your goals into lasting habits with friends by your side.
                Track progress, celebrate wins, and stay motivated with social accountability.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-8 py-4">
                  <PlayCircle className="w-6 h-6" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { number: "50K+", label: "Active Users" },
                { number: "2M+", label: "Habits Tracked" },
                { number: "94%", label: "Success Rate" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
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
                    <h4 className="font-semibold text-foreground">Today's Habits</h4>
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
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              How Ritmo Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to transform your habits and achieve your goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Set Your Goals",
                description: "Define what you want to achieve and break it down into daily habits",
                color: "var(--color-goals)"
              },
              {
                step: "02",
                title: "Find Your Tribe",
                description: "Connect with friends or join communities with similar goals",
                color: "var(--color-friends)"
              },
              {
                step: "03",
                title: "Track & Celebrate",
                description: "Log your progress daily and celebrate wins together",
                color: "var(--color-habits)"
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6"
                  style={{ backgroundColor: item.color }}
                >
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{item.title}</h3>
                <p className="text-muted-foreground text-lg">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ChevronRight className="w-8 h-8 text-muted mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Real Stories, Real Results
            </h2>
            <p className="text-xl text-muted-foreground">
              See how Ritmo has helped people transform their lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 border border-border shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {testimonial.streak} day streak
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-white">
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
              <button className="text-white border border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all">
                Download App
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">R</span>
              </div>
              <span className="text-2xl font-bold text-foreground">Ritmo</span>
            </div>

            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>

          <div className="text-center mt-8 text-muted-foreground">
            <p>&copy; 2025 Ritmo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RitmoLanding;