import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface PageHeadersProps {
    title: string
    defination: string
    showButton?: boolean
    buttonAction?: () => void
    textColor?: string
    buttonStyle?: string
}

const PageHeaders = ({
    title,
    defination,
    showButton = false,
    buttonAction,
    textColor,
    buttonStyle
}
    : PageHeadersProps
) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>{title}</h1>
                <p className="text-muted-foreground">{defination}</p>
            </div>
            {
                showButton &&
                <Button onClick={buttonAction} className={`${buttonStyle}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                </Button>
            }
        </div>
    )
}

export default PageHeaders