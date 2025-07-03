import {
  Home,
  Target,
  Settings,
  Calendar,
  Users,
  Search,
  Zap,
  FileText,
  Trophy,
  Package,
  MessageSquare,
  Gamepad2,
  LayoutDashboard,
  CheckCircle,
} from 'lucide-react';

// Dummy data imports

export const CONNECTIONS = [
  {
    id: "user1",
    name: "Sarah Johnson",
    avatar: null,
    online: true,
    lastActive: new Date(),
    streak: 8
  },
  {
    id: "user2",
    name: "Michael Wong",
    avatar: null,
    online: false,
    lastActive: new Date(Date.now() - 3600000), // 1 hour ago
    streak: 12
  },
  {
    id: "user3",
    name: "Emma Lewis",
    avatar: null,
    online: true,
    lastActive: new Date(),
    streak: 5
  }
];

export const CATEGORIES = [
  { name: 'Fitness', count: 5 },
  { name: 'Work', count: 7 },
  { name: 'Learning', count: 3 },
  { name: 'Personal', count: 4 }
];

export const slogans = [
  "Find your rhythm, stay on track.",
  "Design your days. Define your life.",
  "Build habits, together.",
  "Align with your rhythm. Elevate your life.",
  "Your rhythm. Your growth."
];
{/* Nav links */ }
export const NAV_LINKS = [
  { name: 'home', icon: Home, href: '/dashboard/' },
  { name: 'planner', icon: Calendar, href: '/dashboard/planner' },
  { name: 'social', icon: Users, href: '/dashboard/planner' },
  { name: 'habits', icon: CheckCircle, href: '/dashboard/habits' },
  { name: 'goals', icon: Target, href: '/dashboard/goals' },
  { name: 'discover', icon: Search, href: '/dashboard/discover' },
  { name: 'motivation', icon: Zap, href: '/dashboard/motivation' },
];

export const ADMIN_NAV_LINKS = [
  { icon: LayoutDashboard, name: 'dashboard', href: '/admin/dashboard' },
  { icon: Users, name: 'users', href: '/admin/users' },
  { icon: FileText, name: 'content', href: '/admin/content' },
  { icon: Trophy, name: 'challenges', href: '/admin/challenges' },
  { icon: Package, name: 'packs', href: '/admin/packs' },
  { icon: MessageSquare, name: 'communications', href: '/admin/communications' },
  { icon: Gamepad2, name: 'gamifications', href: '/admin/gamifications' },
  { icon: Settings, name: 'settings', href: '/admin/settings' },
];

export const contacts = [
  "jane",
  "sarah",
  "mike",
  "emma"
];

export const DAYS_OF_WEEK = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
];