import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import React from 'react'

type Props = {
    pageIcon: LucideIcon,
    title: string
    subtitle?: string
    buttonText?: string
    buttonIcon?: LucideIcon
    buttonAction?: () => void
}

const PageHeader = ({ pageIcon, title, subtitle, buttonText, buttonIcon, buttonAction }: Props) => {

    const PageIcon = pageIcon
    const ButtonIcon = buttonIcon

    return (
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
                <PageIcon className="text-primary w-8 h-8" />
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {title}
                    </h1>
                    {
                        subtitle
                        &&
                        <p className='text-muted-foreground'>
                            {subtitle}
                        </p>
                    }
                </div>
            </div>
            {
                buttonText
                &&
                buttonAction
                &&
                <Button
                    variant="outline"
                    onClick={buttonAction}
                >
                    {
                        ButtonIcon
                        &&
                        <ButtonIcon className="w-4 h-4" />
                    }
                    <span>{buttonText}</span>
                </Button>
            }
        </div>
    )
}

export default PageHeader