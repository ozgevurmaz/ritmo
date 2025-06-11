"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, ListTodo } from "lucide-react";
import TodosChecklist from "./todosCheckbox";
import { useTranslations } from "next-intl";

interface TodosSectionProps {
  todos: TodoType[];
  type: "urgent" | "normal" | "completed";
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

const iconMap = {
  urgent: <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-50" />,
  normal: <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-50" />,
  completed: <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />,
};

const TodosSection = ({ todos, type, userId }: TodosSectionProps) => {
    const t = useTranslations("todos.empty")
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {iconMap[type]}
        <p>{t(`${type}.title`)}</p>
        <p className="text-sm">{t(`${type}.subtitle`)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodosChecklist key={todo.id} todo={todo} userId={userId} />
      ))}
    </div>
  );
};

export default TodosSection;
