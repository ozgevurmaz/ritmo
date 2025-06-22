import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTranslations } from 'next-intl'
import React from 'react'
import { Control, Controller, FieldErrors, FieldValues, Path } from 'react-hook-form'

interface CategorySelectionProps<T extends FieldValues> {
    control: Control<T>,
    controlName: Path<T>
    errors: FieldErrors<T>
}

export const CategorySelection = <T extends FieldValues>({ control, errors, controlName }: CategorySelectionProps<T>) => {

    const t = useTranslations("forms.category")

    const categories: string[] = t.raw("categories");

    return (
        <div className="space-y-2 w-auto md:w-1/3">
            <div className="text-sm font-medium flex items-center gap-1">
                {t("label")}
                <span className="text-destructive">*</span>
            </div>
            <Controller
                name={controlName}
                control={control}
                render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} >
                        <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                            <SelectValue placeholder={t("placeholder")} />
                        </SelectTrigger>
                        <SelectContent className='bg-background'>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
            {errors[controlName] && (
                <p className="text-sm text-destructive">
                    {String(errors[controlName]?.message)}
                </p>
            )}
        </div>
    )
}