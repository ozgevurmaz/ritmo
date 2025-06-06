interface UserType {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    avatar: string | null;
    streak: number;
    notifications: number;
    messages: number;
}