import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface FormWrapperProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    children: React.ReactNode;
    variant?: "page" | "dialog" | "element";
}

export const FormWrapper = ({
    title,
    icon: Icon,
    children,
    description,
    variant = "dialog",
}: FormWrapperProps) => {
    const WrapperHeader = variant === "dialog" ? DialogHeader : CardHeader;
    const WrapperTitle = variant === "dialog" ? DialogTitle : CardTitle;
    const WrapperDescription = variant === "dialog" ? DialogDescription : CardDescription;

    return (
        <Card className={`${variant !== "element" ? "border-none bg-transparent shadow-none" : ""} relative`}>
            <WrapperHeader>
                <WrapperTitle className="flex items-center gap-2 text-lg font-semibold px-5 md:px-6">
                    <Icon className={`h-5 w-5 ${variant !== "element" && "text-primary h-6 w-6"}`} />
                    {title}
                </WrapperTitle>
                {description && (
                    <WrapperDescription className="text-muted-foreground text-sm px-5 md:px-6">
                        {description}
                    </WrapperDescription>
                )}
            </WrapperHeader>

            <CardContent className="space-y-4">{children}</CardContent>
        </Card>
    );
};

