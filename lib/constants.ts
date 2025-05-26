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
export const TODOS = [
  {
    id: "todo1",
    title: "Weekly Planning Session",
    urgent: "High",
    importance: "High",
    deadline: "2025-05-22",
    time: "19:00",
    completed: false,
    repeat: "weekly",
    notifyBefore: "1h",
    tags: ["planning", "focus"],
    category: "Work"
  },
  {
    id: "todo2",
    title: "Pay Internet Bill",
    urgent: "Medium",
    importance: "Low",
    deadline: "2025-05-23",
    time: "15:00",
    completed: true,
    repeat: "monthly",
    notifyBefore: "1d",
    tags: ["personal", "finance"],
    category: "Personal"
  },
  {
    id: "todo3",
    title: "Send Portfolio to Sarah",
    urgent: "High",
    importance: "High",
    deadline: "2025-05-21",
    time: "17:30",
    completed: false,
    repeat: "none",
    notifyBefore: "30m",
    tags: ["career"],
    category: "Work"
  }
];
export const HABITS = [
  {
    id: "habit1",
    title: "Drink Water",
    goal: "Healthy Life",
    frequencyPerDay: 8,
    times: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"],
    completedToday: 3,
    streak: 5,
    customMessage: "Hydration is power!",
    reminderSound: "water-drop.mp3",
    allowSkip: true,
    category: "Fitness"
  },
  {
    id: "habit2",
    title: "Read 20 Pages",
    goal: null,
    frequencyPerDay: 1,
    times: ["21:00"],
    completedToday: 0,
    streak: 2,
    customMessage: "A page a day keeps ignorance away.",
    reminderSound: "book-flip.mp3",
    allowSkip: false,
    category: "Learning"
  }
];
export const GOALS = [
  {
    id: "goal1",
    title: "Healthy Life",
    description: "Become more energetic and improve overall health.",
    motivation: "To wake up feeling refreshed and be more productive.",
    habits: ["habit1", "habit2"],
    startDate: "2025-05-20",
    endDate: "2025-06-20",
    completedDays: 5,
    sharedWith: ["user123", "user456"],
    visibility: "private",
    category: "Fitness"
  },
  {
    id: "goal2",
    title: "Deep Work Focus",
    description: "Minimize distractions and get more done.",
    motivation: "To finish my side project in 3 weeks.",
    habits: [],
    startDate: "2025-05-21",
    endDate: "2025-06-10",
    completedDays: 1,
    sharedWith: [],
    visibility: "public",
    category: "Work"
  }
];

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
  { name: 'Logs', icon: FileText, href: '/logs' },
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