"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { Clock, Edit } from "lucide-react";
import { useState } from "react";
import TodoForm from "../Forms/todoForm";

interface TodosChecklistProps {
    todo: TodoType;
    toggleTodo: () => void;
    userId: string;
}

export default function TodosChecklist({ todo, toggleTodo, userId }: TodosChecklistProps) {
    const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false);

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditFormOpen(true);
    };

    const isOverdue = todo.deadline && new Date(todo.deadline) < new Date() && !todo.completed;

    return (
        <>
            <div
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer"
            >
                <Checkbox
                    checked={todo.completed}
                    className="mt-0.5 border-foreground cursor-pointer data-[state=checked]:bg-todos data-[state=checked]:border-todos shrink-0"
                    onClick={() => { toggleTodo() }}
                />

                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium transition-colors ${todo.completed
                        ? 'line-through text-muted-foreground'
                        : isOverdue && todo.type === "task"
                            ? 'text-destructive'
                            : 'text-foreground'
                        }`}>
                        {todo.title}
                    </div>

                    {todo.deadline && (
                        <div className={`flex items-center gap-1 mt-1 text-xs transition-colors ${todo.completed
                            ? "line-through text-muted-foreground"
                            : isOverdue && todo.type === "task"
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                            }`}>
                            {todo.time && (
                                <>
                                    <Clock className="h-3 w-3" />
                                    {todo.time} -
                                </>
                            )}
                            {formatDate(new Date(todo.deadline), {
                                day: "2-digit",
                                weekday: "short",
                                month: "short",
                                year: false
                            })}
                            {isOverdue && todo.type === "task" && (
                                <span className="ml-1 text-xs font-medium">
                                    (Overdue)
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Badge
                        variant="secondary"
                        className={`text-xs ${getPriorityColor(todo.urgent, todo.importance)} ${todo.completed && "opacity-50"
                            }`}
                    >
                        {getPriorityLabel(todo.urgent, todo.importance)}
                    </Badge>

                    <Button
                        onClick={handleEditClick}
                        disabled={todo.completed}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted hover:text-foreground disabled:opacity-0"
                        aria-label={`Edit ${todo.title}`}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <TodoForm
                isOpen={isEditFormOpen}
                setIsOpen={() => setIsEditFormOpen(false)}
                editingTodo={todo}
                userId={userId}
            />
        </>
    );
}