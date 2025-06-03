"use client"

import React, { useEffect, useState } from 'react';
import { CheckCircle, Target, ListTodo, TrendingUp, Users, Zap } from 'lucide-react';
import { slogans } from '@/lib/constants';

const LoadingScreen = () => {

  const [currentSlogan, setCurrentSlogan] = useState("");

  useEffect(() => {
    const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
    setCurrentSlogan(randomSlogan);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex flex-col gap-7 items-center justify-center z-50 text-center">

      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Zap className="w-5 h-5 text-primary-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">
        Ritmo
      </h1>

      <p className="text-muted-foreground">
        Track • Build • Achieve
      </p>

      <div className="w-64 mx-auto">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[fillBar_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <div className="text-muted-foreground text-sm space-y-2">
        <div className="animate-pulse">
          {currentSlogan}
        </div>
        <div>
          <span className="inline-block animate-[bounce_1s_infinite] mr-1">Loading</span>
          <span className="inline-block animate-[bounce_1s_infinite_0.1s] mr-1">your</span>
          <span className="inline-block animate-[bounce_1s_infinite_0.2s] mr-1">workspace</span>
          <span className="inline-block animate-[bounce_1s_infinite_0.3s]">...</span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-[float_3s_ease-in-out_infinite]">
          <div className="w-8 h-8 bg-card border border-border rounded-full flex items-center justify-center opacity-60">
            <Target className="w-4 h-4 text-[hsl(var(--color-goals))]" />
          </div>
        </div>

        <div className="absolute top-1/3 right-1/4 animate-[float_3s_ease-in-out_infinite_1s]">
          <div className="w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center opacity-60">
            <ListTodo className="w-3 h-3 text-[hsl(var(--color-todos))]" />
          </div>
        </div>

        <div className="absolute bottom-1/3 left-1/3 animate-[float_3s_ease-in-out_infinite_2s]">
          <div className="w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center opacity-60">
            <TrendingUp className="w-4 h-4 text-[hsl(var(--color-habits))]" />
          </div>
        </div>

        <div className="absolute top-2/3 right-1/3 animate-[float_3s_ease-in-out_infinite_1.5s]">
          <div className="w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center opacity-60">
            <CheckCircle className="w-3 h-3 text-[hsl(var(--color-activities))]" />
          </div>
        </div>

        <div className="absolute bottom-1/4 right-1/4 animate-[float_3s_ease-in-out_infinite_0.5s]">
          <div className="w-7 h-7 bg-card border border-border rounded-full flex items-center justify-center opacity-60">
            <Users className="w-4 h-4 text-[hsl(var(--color-friends))]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;