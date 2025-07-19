import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlarmCheck, Calendar, Target, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';
import { useTranslations } from 'next-intl';

type Props = {

    title: string;
    frequencyPerDay: number;
    allowSkip: boolean;
    weeklyFrequency: number;
    selectedDays: string[];
    reminderTimes?: string[] | undefined;

    id?: string;
    category?: string;
    status?: 'active' | 'paused' | 'completed';

    variant?: 'default' | 'compact';
    showActions?: boolean;
    showCheckbox?: boolean;
    showStatus?: boolean;

    editAction?: (id: string) => void;
    deleteAction?: (id: string) => void;
    checkboxAction?: (checked: boolean) => void;
    onStatusChange?: (status: 'active' | 'paused' | 'completed') => void;
}

const GoalHabitCard = (props: Props) => {
    const t = useTranslations()
    const {
        variant = 'default',
        showActions = true,
        showCheckbox = false,
        showStatus = false,
    } = props;

    const formatSchedule = () => {
        if (props.weeklyFrequency === 7) {
            return t("forms.repeat.options.daily");
        }
        return t("forms.repeat.weekly-count", { count: props.weeklyFrequency });
    };

    const getStatusColor = () => {
        switch (props.status) {
            case 'active': return 'bg-success/10 text-success border-success/20';
            case 'paused': return 'bg-warning/10 text-warning border-warning/20';
            case 'completed': return 'bg-accent/10 text-accent border-accent/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getCategoryColor = () => {
        // You can customize these based on your category system
        const categoryColors: { [key: string]: string } = {
            'health': 'bg-habits/10 text-habits border-habits/20',
            'productivity': 'bg-goals/10 text-goals border-goals/20',
            'personal': 'bg-activities/10 text-activities border-activities/20',
            'social': 'bg-friends/10 text-friends border-friends/20',
        };

        return categoryColors[props.category?.toLowerCase() || ''] || 'bg-muted/50 text-muted-foreground';
    };

    // Compact variant for forms
    if (variant === 'compact') {
        return (
            <div className='bg-card border border-border rounded-lg p-2 hover:shadow-sm transition-shadow'>
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2 flex-1 min-w-0'>
                        {showCheckbox && (
                            <Checkbox
                                onCheckedChange={props.checkboxAction}
                                className='flex-shrink-0'
                            />
                        )}

                        <div className='flex-1 min-w-0'>
                            <h5 className='font-medium text-sm truncate'>{props.title}</h5>
                            <div className='flex items-center gap-1 text-xs text-muted-foreground'>
                                <Badge variant="secondary" className='text-xs px-1 py-0.5 h-4'>
                                    {props.frequencyPerDay}x
                                </Badge>
                                <span>•</span>
                                <span>{formatSchedule()}</span>
                                {props.reminderTimes && props.reminderTimes.length > 0 && (
                                    <>
                                        <span>•</span>
                                        <AlarmCheck className='h-3 w-3' />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {showActions && (props.editAction || props.deleteAction) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className='h-6 w-6 p-0 flex-shrink-0'>
                                    <MoreHorizontal className='h-3 w-3' />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className='bg-card'>
                                {props.editAction && (
                                    <DropdownMenuItem onClick={() => props.editAction?.(props.id!)}>
                                        <Edit3 className='h-4 w-4 mr-2' />
                                        {t("buttons.edit")}
                                    </DropdownMenuItem>
                                )}
                                {props.deleteAction && (
                                    <DropdownMenuItem
                                        onClick={() => props.deleteAction?.(props.id!)}
                                        className='text-destructive focus:text-destructive'
                                    >
                                        <Trash2 className='h-4 w-4 mr-2' />
                                        {t("buttons.remove")}
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className='bg-card border border-border rounded-lg p-3 hover:shadow-sm transition-shadow'>
            {/* Header with title and actions */}
            <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center gap-2 flex-1'>
                    {showCheckbox && (
                        <Checkbox
                            onCheckedChange={props.checkboxAction}
                        />
                    )}
                    <h4 className='font-medium text-foreground truncate flex-1 mr-2'>
                        {props.title}
                    </h4>
                    {props.category && (
                        <Badge className={`text-xs ${getCategoryColor()}`}>
                            {props.category}
                        </Badge>
                    )}
                    {showStatus && props.status && (
                        <Badge className={`text-xs ${getStatusColor()}`}>
                            {props.status}
                        </Badge>
                    )}
                </div>

                {showActions && (props.editAction || props.deleteAction) && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className='h-6 w-6 p-0'>
                                <MoreHorizontal className='h-3 w-3' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='bg-card'>
                            {props.editAction && (
                                <DropdownMenuItem onClick={() => props.editAction?.(props.id!)}>
                                    <Edit3 className='h-4 w-4 mr-2' />
                                    {t("buttons.edit")}
                                </DropdownMenuItem>
                            )}
                            {props.deleteAction && (
                                <DropdownMenuItem
                                    onClick={() => props.deleteAction?.(props.id!)}
                                    className='text-destructive focus:text-destructive'
                                >
                                    <Trash2 className='h-4 w-4 mr-2' />
                                    {t("buttons.remove")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Compact info row */}
            <div className='flex items-center gap-2 text-xs text-muted-foreground flex-wrap'>
                {/* Frequency */}
                <div className='flex items-center gap-1'>
                    <Target className='h-3 w-3 text-habits' />
                    <Badge variant="secondary" className='text-xs px-1.5 py-0.5 h-5'>
                        {t("forms.repeat.daily", { count: props.frequencyPerDay })}
                    </Badge>
                </div>

                <div className='w-1 h-1 bg-muted-foreground rounded-full opacity-50' />

                {/* Schedule */}
                <div className='flex items-center gap-1'>
                    <Calendar className='h-3 w-3 text-habits' />
                    <span className='text-xs'>{formatSchedule()}</span>
                </div>

                {/* Days (compact) */}
                {props.selectedDays && (
                    <>
                        <div className='w-1 h-1 bg-muted-foreground rounded-full opacity-50' />
                        <div className='flex gap-0.5'>
                            {props.selectedDays.map((day, index) => (
                                <span key={index} className='text-xs font-mono bg-muted px-1 py-0.5 rounded text-muted-foreground'>
                                    {t(`forms.days-selection.days.${day}.short`)}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                {/* Reminders */}
                {props.reminderTimes && props.reminderTimes.length > 0 && (
                    <>
                        <div className='w-1 h-1 bg-muted-foreground rounded-full opacity-50' />
                        <div className='flex items-center gap-1'>
                            <AlarmCheck className='h-3 w-3 text-accent' />
                            <span className='text-xs'>{props.reminderTimes.length} reminder{props.reminderTimes.length > 1 ? 's' : ''}</span>
                        </div>
                    </>
                )}

                {/* Skip indicator */}
                {props.allowSkip && (
                    <>
                        <div className='w-1 h-1 bg-muted-foreground rounded-full opacity-50' />
                        <Badge variant="outline" className='text-xs px-1.5 py-0.5 h-5'>
                            {t("forms.habit.fields.allow-skip.skip-ok")}
                        </Badge>
                    </>
                )}
            </div>
        </div>
    );
};

export default GoalHabitCard;