import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { contacts } from '@/lib/constants'
import { Label } from '@radix-ui/react-label'
import { Eye, EyeOff, Users } from 'lucide-react'
import React, { ReactElement } from 'react'
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
    userId,
    control,
    visibility,
    selectedContacts,
    visibilityName,
    handleContactChange,
}: PrivacyCardProps<T>) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" />
                    Privacy & Sharing
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Visibility Settings */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Visibility</Label>
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
                                            <div className="font-medium">Private</div>
                                            <div className="text-xs text-muted-foreground">Only you can see this todo</div>
                                        </div>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="public" id="public" className='border-foreground/70' />
                                    <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Eye className="h-4 w-4" />
                                        <div>
                                            <div className="font-medium">Public</div>
                                            <div className="text-xs text-muted-foreground">Others can view and encourage your progress</div>
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
                            <Label className="text-sm font-medium">Share with specific people</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                                Choose people who can view and encourage your progress
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
                            <Alert className="border-green-200 bg-green-50">
                                <Users className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Sharing with {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}