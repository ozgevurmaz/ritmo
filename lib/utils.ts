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

type FormatOptions = {
  weekday?: 'long' | 'short' | 'narrow' | false;
  day?: 'numeric' | '2-digit' | false;
  month?: 'long' | 'short' | '2-digit' | 'numeric' | false;
  year?: 'numeric' | '2-digit' | false;
  locale?: string;
};
export const formatDate = (
  date: Date,
  {
    weekday = false,
    day = '2-digit',
    month = 'short',
    year = '2-digit',
    locale = 'en-GB',
  }: FormatOptions = {}
): string => {
  const options: Intl.DateTimeFormatOptions = {};

  if (weekday) options.weekday = weekday;
  if (day) options.day = day;
  if (month) options.month = month;
  if (year) options.year = year;

  return date.toLocaleDateString(locale, options);
};

export const formatDateForQuery = (date: Date) => date.toISOString().split("T")[0];

export const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

export const getGreetingKey = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "good-morning";
  if (hour < 17) return "good-afternoon";
  return "good-evening";
};