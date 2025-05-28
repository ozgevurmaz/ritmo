import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Clock, Edit, Ghost } from "lucide-react";

interface TodosChecklistProps {
    todo: TodoType,
    toggleTodo: () => void,
}

export default function TodosChecklist({ todo, toggleTodo }: TodosChecklistProps) {
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
                <Badge className={`text-sm ${todo.urgent === "High" ? "bg-red-400" : todo.urgent === "Medium" ? "bg-amber-300" : "bg-blue-400"} ${todo.completed && "opacity-50"}`}>
                    {todo.urgent}
                </Badge>

                <Button disabled={todo.completed} variant="ghost" className="p-0 hover:bg-transperent hover:text-foreground cursor-pointer"><Edit /></Button>
            </div>
        </div>)
}