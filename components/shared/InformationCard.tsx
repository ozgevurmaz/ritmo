import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserIcon } from 'lucide-react'

interface InformationCardProps {
    children: React.ReactNode,
    title: string,
    description: string
}
const InformationCard = ({ children, title, description }: InformationCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex items-center gap-4">
                    <UserIcon className="w-5 h-5 text-primary" />
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            {description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {children}
            </CardContent>
        </Card>
    )
}

export default InformationCard