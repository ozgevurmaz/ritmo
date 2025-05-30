import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Get initials from name for avatar fallback
export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};

export const getPriorityColor = (urgent: string, importance: string) => {
  if (urgent === 'High' && importance === 'High') return 'bg-red-100 text-red-800';
  if (urgent === 'High' || importance === 'High') return 'bg-orange-100 text-orange-800';
  if (urgent === 'Medium' || importance === 'Medium') return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
};

export const getPriorityLabel = (urgent: string, importance: string) => {
  if (urgent === 'High' && importance === 'High') return 'Critical';
  if (urgent === 'High' && importance === 'Low') return 'Urgent';
  if (urgent === 'Low' && importance === 'High') return 'Important';
  return 'Normal';
};

export const getStreakColor = (streak: number) => {
  if (streak >= 30) return 'text-purple-600 bg-purple-100 border-purple-600';
  if (streak >= 14) return 'text-blue-600 bg-blue-100 border-blue-600';
  if (streak >= 7) return 'text-green-600 bg-green-100 border-green-600';
  if (streak >= 3) return 'text-orange-600 bg-orange-100 border-orange-600';
  return 'text-foreground border-foreground';
};

export const getDaysRemaining = (endDate: Date) => {
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const formatDate = (selectedDate: Date) => {
  return selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};
