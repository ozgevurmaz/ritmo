import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, X, Clock } from "lucide-react";
import React from "react";

interface ReminderTimeInputProps {
  timeInput: string;
  setTimeInput: (value: string) => void;
  timesList: string[];
  setTimesList: React.Dispatch<React.SetStateAction<string[]>>;
  frequencyPerDay: number;
}

export const ReminderTimeInput: React.FC<ReminderTimeInputProps> = ({
  timeInput,
  setTimeInput,
  timesList,
  setTimesList,
  frequencyPerDay,
}) => {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTime();
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="time" className="text-sm font-medium flex items-center gap-1">
        <Bell className="h-4 w-4" />
        Reminder Times (Optional)
      </Label>

      <div className="flex gap-2">
        <Input
          type="time"
          name="time"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Set reminder time"
          disabled={timesList.length >= frequencyPerDay}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={addTime}
          size="sm"
          variant="outline"
          disabled={!timeInput || timesList.length >= frequencyPerDay}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {timesList.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {timesList.map((time) => (
            <Badge key={time} variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {time}
              <button
                type="button"
                onClick={() => removeTime(time)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {timesList.length}/{frequencyPerDay} reminder times set
      </p>
    </div>
  );
};
