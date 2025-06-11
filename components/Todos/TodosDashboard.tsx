"use client"

import React, { useState } from 'react'
import PageHeaders from '../shared/Headers/PageHeaders'
import { useTodosAnalytics } from '@/hooks/analytics'
import AnalyticsCard from '../shared/AnalyticsCard'
import { useTodos } from '@/lib/Queries/todos/useTodo'
import TodoTabs from './TodoTabs'
import { useTranslations } from 'next-intl'
import TodoForm from '../Forms/todoForm'

interface TodoDashboardProps {
    userId: string
}
const TodosDashboard = ({ userId }: TodoDashboardProps) => {
    const t = useTranslations("todos")

    const [editingTodo, setEditingTodo] = useState<TodoType | null>(null)
    const [showTodoForm, setShowTodoForm] = useState<boolean>(false)

    const { data: todos = [] } = useTodos(userId)

    const analyticsData = useTodosAnalytics(todos)
    return (
        <div className="space-y-6 p-6">
            <PageHeaders
                title={t("title")}
                definition={t("definition")}
                showButton
                buttonAction={() => {
                    setEditingTodo(null)
                    setShowTodoForm(true)
                }}
                textColor="text-todos"
                buttonStyle="bg-todos hover:bg-todos/60"
                buttonText={t("add-button")}
            />

            <AnalyticsCard data={analyticsData} />

            <TodoTabs userId={userId} todos={todos} />

            <TodoForm isOpen={showTodoForm} setIsOpen={() => setShowTodoForm(false)} userId={userId} />

        </div>
    )
}

export default TodosDashboard
