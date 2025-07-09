"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, X, Clock } from "lucide-react";
import React, { useState } from "react";
import CustomTimePicker from "../../custom/CustomTimePicker";

interface ReminderTimeInputProps {
  timeInput: string;
  setTimeInput: (value: string) => void;
  timesList: string[];
  setTimesList: React.Dispatch<React.SetStateAction<string[]>>;
  frequencyPerDay: number;
  use24Hour?: boolean;
}

export const ReminderTimeInput: React.FC<ReminderTimeInputProps> = ({
  timeInput,
  setTimeInput,
  timesList,
  setTimesList,
  frequencyPerDay,
  use24Hour = true
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);

  const addTime = () => {
    if (!timeInput) return;
    if (timesList.includes(timeInput)) return;
    if (timesList.length >= frequencyPerDay) return;

    setTimesList((prev) => [...prev, timeInput].sort());
    setTimeInput("");
  };

  const removeTime = (timeToRemove: string) => {
    setTimesList((prev) => prev.filter((time) => time !== timeToRemove));
  };

  const formatDisplayTime = (timeString: string) => {
    if (use24Hour) {
      return timeString;
    } else {
      // Convert 24h to 12h format for display
      const [hours, minutes] = timeString.split(':').map(Number);
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium flex items-center gap-1">
        <Bell className="h-4 w-4" />
        Reminder Times (Optional)
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Button
            type="button"
            onClick={() => setShowTimePicker(true)}
            className="justify-start text-left bg-transparent border-input w-full h-10"
            variant="outline"
            disabled={timesList.length >= frequencyPerDay}
          >
            <span className="flex-1 text-left">
              {timeInput ? formatDisplayTime(timeInput) : "Set reminder time"}
            </span>
            <Clock className="h-4 w-4 ml-2" />
          </Button>

          {showTimePicker && (
            <CustomTimePicker
              isTimePickerOpen={showTimePicker}
              setIsTimePickerOpen={setShowTimePicker}
              selectedTime={timeInput || undefined}
              use24Hour={use24Hour}
              onTimeSelect={(time) => {
                setTimeInput(time);
              }}
            />
          )}
        </div>

        <Button
          type="button"
          onClick={addTime}
          size="sm"
          variant="outline"
          disabled={!timeInput || timesList.length >= frequencyPerDay}
          className="px-3"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {timesList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {timesList.map((time) => (
            <Badge key={time} variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDisplayTime(time)}
              <button
                type="button"
                onClick={() => removeTime(time)}
                className="ml-1 hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{timesList.length}/{frequencyPerDay} reminder times set</span>
        {timesList.length >= frequencyPerDay && (
          <span className="text-amber-600">Maximum reminders reached</span>
        )}
      </div>
    </div>
  );
};