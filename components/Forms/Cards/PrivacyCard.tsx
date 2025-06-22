import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { contacts } from '@/lib/constants'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface PrivacyCardProps<T extends FieldValues> {
    userId: string;
    control: Control<T>;
    visibilityName: Path<T>;
    visibility: string;
    selectedContacts: string[];
    handleContactChange: (contact: string, checked: boolean) => void;
}

export const PrivacyCard = <T extends FieldValues>({
    control,
    visibility,
    selectedContacts,
    visibilityName,
    handleContactChange,
}: PrivacyCardProps<T>) => {
    const t = useTranslations("forms.privacy")
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    {t("title")}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Visibility Settings */}
                <div className="space-y-3">
                    <Controller
                        name={visibilityName}
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="space-y-3"
                            >
                                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="private" id="private" className='border-foreground/70' />
                                    <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <EyeOff className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">{t("private")}</div>
                                            <div className="text-xs text-muted-foreground">{t("private-description")}</div>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="public" id="public" className='border-foreground/70' />
                                    <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Eye className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">{t("public")}</div>
                                            <div className="text-xs text-muted-foreground">{t("public-description")}</div>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                </div>

                {/* Share With Contacts */}
                {visibility === "public" && (
                    <div className="space-y-3">
                        <div className='bg-muted w-full h-[1px]' />
                        <div>
                            <div className="text-md font-medium">{t("share.label")}</div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t("share.description")}
                            </p>
                        </div>
                        <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 bg-background">
                            {contacts.map((contact) => (
                                <div key={contact} className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors">
                                    <Checkbox
                                        id={contact}
                                        checked={selectedContacts.includes(contact)}
                                        onCheckedChange={(checked) => handleContactChange(contact, checked as boolean)}
                                        className='border-foreground'
                                    />
                                    <Label htmlFor={contact} className="text-sm cursor-pointer flex-1">
                                        {contact}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {selectedContacts.length > 0 && (
                            <Alert className="border-friends bg-friends/20 text-friends">
                                <Users className="h-4 w-4" />
                                <AlertDescription className="text-friends">
                                    {t("share.status", { count: selectedContacts.length })}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}