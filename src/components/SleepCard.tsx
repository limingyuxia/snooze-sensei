
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Moon, Sun, BedDouble, Plus, Minus } from "lucide-react";

interface SleepCardProps {
  title: string;
  value: string;
  icon: "sleep" | "wake" | "duration";
  onValueChange: (newValue: string) => void;
}

const SleepCard = ({ title, value, icon, onValueChange }: SleepCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case "sleep":
        return <Moon className="w-6 h-6 text-sleep-accent" />;
      case "wake":
        return <Sun className="w-6 h-6 text-sleep-accent" />;
      case "duration":
        return <BedDouble className="w-6 h-6 text-sleep-accent" />;
    }
  };

  const adjustTime = (direction: 'up' | 'down') => {
    if (icon === 'duration') {
      const currentHours = parseInt(value);
      const newHours = direction === 'up' ? currentHours + 1 : currentHours - 1;
      if (newHours >= 1 && newHours <= 24) {
        onValueChange(`${newHours}小时`);
      }
      return;
    }

    const [hours, minutes] = value.split(':').map(Number);
    let newHours = hours;
    let newMinutes = minutes;

    if (direction === 'up') {
      newMinutes += 30;
      if (newMinutes >= 60) {
        newMinutes = 0;
        newHours = (newHours + 1) % 24;
      }
    } else {
      newMinutes -= 30;
      if (newMinutes < 0) {
        newMinutes = 30;
        newHours = (newHours - 1 + 24) % 24;
      }
    }

    onValueChange(`${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`);
  };

  return (
    <Card className="p-6 card-hover">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-sleep-lavender/30">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold text-sleep-deep">{value}</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => adjustTime('up')}
                className="p-1 rounded-full hover:bg-sleep-lavender/30 transition-colors"
                aria-label="增加时间"
              >
                <Plus className="w-4 h-4 text-sleep-deep" />
              </button>
              <button
                onClick={() => adjustTime('down')}
                className="p-1 rounded-full hover:bg-sleep-lavender/30 transition-colors"
                aria-label="减少时间"
              >
                <Minus className="w-4 h-4 text-sleep-deep" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SleepCard;
