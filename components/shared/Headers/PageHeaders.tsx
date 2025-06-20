import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PageHeadersProps {
    title: string
    definition: string
    showButton?: boolean
    buttonAction?: () => void
    textColor?: string
    buttonStyle?: string
    buttonText?: string
}

const PageHeaders = ({
    title,
    definition,
    showButton = false,
    buttonAction,
    textColor,
    buttonStyle,
    buttonText ,
}
    : PageHeadersProps
) => {
    const t = useTranslations()
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className={`text-3xl font-bold ${textColor}`}>{title}</h1>
                <p className="text-muted-foreground">{definition}</p>
            </div>
            {
                showButton &&
                <Button onClick={buttonAction} className={`${buttonStyle}`}>
                    <Plus className="h-4 w-4 mr-2" />
                    {buttonText || t('common.add-button')}
                </Button>
            }
        </div>
    )
}

export default PageHeaders