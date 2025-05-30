"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import { Clock, Edit } from "lucide-react";
import { useState } from "react";
import TodoForm from "../Forms/todoForm";

interface TodosChecklistProps {
    todo: TodoType,
    toggleTodo: () => void,
    userId: string
}

export default function TodosChecklist({ todo, toggleTodo, userId }: TodosChecklistProps) {
    const [isEditFormOpen, setIsEditFormOpen] = useState<boolean>(false)

    return (
        <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo()}
                className="mt-0.5 border-todos cursor-pointer data-[state=checked]:bg-todos data-[state=checked]:border-todos"
            />
            <div className="flex-1 min-w-0">
                <div className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {todo.title}
                </div>
                {todo.deadline && (
                    <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${todo.completed && "line-through"}`}>
                        <Clock className="h-3 w-3" />
                        {todo.time} - {new Date(todo.deadline).toLocaleDateString()}
                    </div>
                )}
            </div>
            <div className="flex items-center">
                <Badge className={`text-sm ${getPriorityColor(todo.urgent, todo.importance)} ${todo.completed && "opacity-50"}`}>
                    {getPriorityLabel(todo.urgent, todo.importance)}
                </Badge>

                <Button
                    onClick={() => setIsEditFormOpen(true)}
                    disabled={todo.completed}
                    variant="ghost"
                    className="p-0 hover:bg-transperent hover:text-foreground cursor-pointer">
                    <Edit />
                </Button>
            </div>
            <TodoForm isOpen={isEditFormOpen} setIsOpen={() => setIsEditFormOpen(false)} editingTodo={todo} userId={userId} />
        </div>)
}