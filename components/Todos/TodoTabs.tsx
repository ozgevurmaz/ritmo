"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertTriangle, ListTodo } from "lucide-react";
import { useMemo } from "react";
import TodosSection from "./todosSection";
import { useTranslations } from "next-intl";

interface TodoTabsProps {
    todos: TodoType[];
    userId: string;
}

interface TodoType {
    id: string;
    title: string;
    type: "event" | "task";
    urgent: "High" | "Medium" | "Low";
    importance: "High" | "Medium" | "Low";
    deadline: string;
    time?: string | null;
    notifyBefore: string | null;
    completed: boolean;
    repeat: "never" | "daily" | "weekly" | "monthly" | "yearly";
    tags: string[];
    category: string;
    visibility: "public" | "private";
    sharedWith?: string[];
    completedAt: string | null;
}

export default function TodoTabs({ todos, userId }: TodoTabsProps) {
    const t = useTranslations("common")

    const categorizedTodos = useMemo(() => {
        const now = new Date();

        const completed = todos.filter(todo => todo.completed);

        const pending = todos.filter(todo => !todo.completed);

        // Categorize pending todos by urgency/priority
        const urgent = pending.filter(todo => {
            const isOverdue = todo.deadline && new Date(todo.deadline) < now;
            const isCritical = todo.urgent === 'High' && todo.importance === 'High';
            const isUrgent = todo.urgent === 'High' || todo.importance === 'High';
            return isOverdue || isCritical || isUrgent;
        });

        const normal = pending.filter(todo => {
            const isOverdue = todo.deadline && new Date(todo.deadline) < now;
            const isCritical = todo.urgent === 'High' && todo.importance === 'High';
            const isUrgent = todo.urgent === 'High' || todo.importance === 'High';
            return !isOverdue && !isCritical && !isUrgent;
        });

        // Sort each category
        const sortByDeadline = (a: TodoType, b: TodoType) => {
            if (!a.deadline && !b.deadline) return 0;
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        };

        return {
            urgent: urgent.sort(sortByDeadline),
            normal: normal.sort(sortByDeadline),
            completed: completed.sort((a, b) => {
                if (!a.completedAt && !b.completedAt) return 0;
                if (!a.completedAt) return 1;
                if (!b.completedAt) return -1;
                return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
            })
        };
    }, [todos]);

    return (
        <div className="w-full">
            <Tabs defaultValue="urgent" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger
                        value="urgent"
                        className="flex items-center gap-2 data-[state=active]:text-todos"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        {t("tabs.urgent")} ({categorizedTodos.urgent.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="normal"
                        className="flex items-center gap-2 data-[state=active]:text-todos"
                    >
                        <ListTodo className="h-4 w-4" />
                        {t("tabs.normal")}  ({categorizedTodos.normal.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="flex items-center gap-2 data-[state=active]:text-todos"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        {t("tabs.completed")}  ({categorizedTodos.completed.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="urgent" className="mt-6">
                    <TodosSection
                        todos={categorizedTodos.urgent}
                        type="urgent"
                        userId={userId}
                    />
                </TabsContent>

                <TabsContent value="normal" className="mt-6">
                    <TodosSection
                        todos={categorizedTodos.normal}
                        type="normal"
                        userId={userId}
                    />
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    <TodosSection
                        todos={categorizedTodos.completed}
                        type="completed"
                        userId={userId}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}