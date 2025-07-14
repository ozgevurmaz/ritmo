import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PageHeadersProps {
    title: string
    definition: string
    showButton?: boolean
    buttonAction?: () => void
    buttonText?: string
}

const PageHeaders = ({
    title,
    definition,
    showButton = false,
    buttonAction,
    buttonText ,
}
    : PageHeadersProps
) => {
    const t = useTranslations()
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-primary">{title}</h1>
                <p className="text-muted-foreground">{definition}</p>
            </div>
            {
                showButton &&
                <Button onClick={buttonAction} variant="default">
                    <Plus className="h-4 w-4 mr-2" />
                    {buttonText || t('common.add-button')}
                </Button>
            }
        </div>
    )
}

export default PageHeaders