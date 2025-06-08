"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertTriangle, ListTodo } from "lucide-react";
import { useMemo } from "react";
import TodosChecklist from "./todosCheckbox";

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
                        Urgent ({categorizedTodos.urgent.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="normal"
                        className="flex items-center gap-2 data-[state=active]:text-todos"
                    >
                        <ListTodo className="h-4 w-4" />
                        Normal ({categorizedTodos.normal.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="flex items-center gap-2 data-[state=active]:text-todos"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Completed ({categorizedTodos.completed.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="urgent" className="mt-6">
                    <div className="space-y-2">
                        {categorizedTodos.urgent.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No urgent todos</p>
                                <p className="text-sm">You're all caught up!</p>
                            </div>
                        ) : (
                            categorizedTodos.urgent.map((todo) => (
                                <TodosChecklist
                                    key={todo.id}
                                    todo={todo}
                                    userId={userId}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="normal" className="mt-6">
                    <div className="space-y-2">
                        {categorizedTodos.normal.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No normal priority todos</p>
                                <p className="text-sm">Add some tasks to get started</p>
                            </div>
                        ) : (
                            categorizedTodos.normal.map((todo) => (
                                <TodosChecklist
                                    key={todo.id}
                                    todo={todo}
                                    userId={userId}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    <div className="space-y-2">
                        {categorizedTodos.completed.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No completed todos</p>
                                <p className="text-sm">Complete some tasks to see them here</p>
                            </div>
                        ) : (
                            categorizedTodos.completed.map((todo) => (
                                <TodosChecklist
                                    key={todo.id}
                                    todo={todo}
                                    userId={userId}
                                />
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}