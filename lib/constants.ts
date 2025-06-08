import {
  Home,
  Target,
  Settings,
  Calendar,
  Users,
  CheckSquare,
  RotateCcw,
  Search,
  Zap,
  FileText,
  FileEdit,
  Trophy,
  Package,
  MessageSquare,
  Gamepad2,
  LayoutDashboard,
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
export const CURRENT_USER: UserType = {
  id: "123",
  name: "David Chen",
  email: "test@example.com",
  username: "david_c",
  role: "client",
  avatar: null,
  streak: 4,
  notifications: 3,
  messages: 2
};

{/* Nav links */ }
export const NAV_LINKS = [
  { name: 'Home', icon: Home, href: '/' },
  { name: 'Planner', icon: Calendar, href: '/planner' },
  { name: 'Social', icon: Users, href: '/planner' },
  { name: 'Todos', icon: CheckSquare, href: '/todos' },
  { name: 'Habits', icon: RotateCcw, href: '/habits' },
  { name: 'Goals', icon: Target, href: '/goals' },
  { name: 'Discover', icon: Search, href: '/discover' },
  { name: 'Motivation', icon: Zap, href: '/discover' },
];

export const ADMIN_NAV_LINKS = [
  { icon: LayoutDashboard, name: 'Dashboard', href: '/admin/dashboard' },
  { icon: Users, name: 'Users', href: '/admin/users' },
  { icon: FileText, name: 'Content', href: '/admin/content' },
  { icon: Trophy, name: 'Challenges', href: '/admin/challenges' },
  { icon: Package, name: 'Packs', href: '/admin/packs' },
  { icon: MessageSquare, name: 'Communications', href: '/admin/communications' },
  { icon: Gamepad2, name: 'Gamifications', href: '/admin/gamifications' },
  { icon: Settings, name: 'Settings', href: '/admin/settings' },
];

export const categories = [
  'Work',
  'Personal',
  'Health',
  'Finance',
  'Education',
  'Shopping',
  'Home',
  'Travel'
];

export const contacts = [
  "jane",
  "sarah",
  "mike",
  "emma"
];

export const PRIORITY_EXPLANATIONS = {
    'High-High': 'Do First - Critical and urgent tasks',
    'High-Medium': 'Do First - Important tasks with some urgency',
    'High-Low': 'Schedule - Important but not urgent',
    'Medium-High': 'Do Next - Urgent but less important',
    'Medium-Medium': 'Schedule - Moderate priority tasks',
    'Medium-Low': 'Delegate - Can be done later or by others',
    'Low-High': 'Do Next - Quick urgent tasks',
    'Low-Medium': 'Delegate - Low priority tasks',
    'Low-Low': 'Eliminate - Consider if really needed'
};

export const DAYS_OF_WEEK = [
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
    { short: "Sun", full: "Sunday" }
];