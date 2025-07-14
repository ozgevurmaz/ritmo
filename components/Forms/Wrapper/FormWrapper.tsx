import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { DialogHeader, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormWrapperProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    children: React.ReactNode;
    variant?: "page" | "dialog" | "element";
    textColor?: string
}

export const FormWrapper = ({
    title,
    icon: Icon,
    children,
    description,
    variant = "dialog",
    textColor
}: FormWrapperProps) => {
    const WrapperHeader = variant === "dialog" ? DialogHeader : CardHeader;
    const WrapperTitle = variant === "dialog" ? DialogTitle : CardTitle;
    const WrapperDescription = variant === "dialog" ? DialogDescription : CardDescription;

    return (
        <Card className={`${variant !== "element" ? "border-none bg-transparent shadow-none" : ""} relative w-full p-6`}>
            <WrapperHeader className='p-0'>
                <WrapperTitle className={`flex items-center gap-2 text-3xl font-semibold ${textColor}`}>
                    <Icon className={`h-5 w-5 ${variant !== "element" && "h-6 w-6"}`} />
                    {title}
                </WrapperTitle>
                {description && (
                    <WrapperDescription className="text-muted-foreground">
                        {description}
                    </WrapperDescription>
                )}
            </WrapperHeader>

            <CardContent className="space-y-4 p-0">{children}</CardContent>
        </Card>
    );
};

