
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Moon, Sun, BedDouble, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SleepCardProps {
  title: string;
  value: string;
  icon: "sleep" | "wake" | "duration";
  onValueChange: (newValue: string) => void;
}

const SleepCard = ({ title, value, icon, onValueChange }: SleepCardProps) => {
  const [hour, minute] = value.split(':').map(Number);

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

  const handleHourChange = (newHour: string) => {
    if (icon === 'duration') {
      onValueChange(`${newHour}小时`);
      return;
    }
    onValueChange(`${newHour.padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  };

  const handleMinuteChange = (newMinute: string) => {
    if (icon === 'duration') return;
    onValueChange(`${String(hour).padStart(2, '0')}:${newMinute.padStart(2, '0')}`);
  };

  if (icon === 'duration') {
    return (
      <Card className="p-6 card-hover">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-sleep-lavender/30">
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="flex items-center gap-3">
              <Select value={value.split('小时')[0]} onValueChange={handleHourChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>小时</SelectLabel>
                    {Array.from({length: 24}, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {i + 1} 小时
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 card-hover">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-sleep-lavender/30">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-center gap-2">
            <Select value={String(hour)} onValueChange={handleHourChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>时</SelectLabel>
                  {Array.from({length: 24}, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {String(i).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <span className="text-sleep-deep">:</span>
            <Select value={String(minute)} onValueChange={handleMinuteChange}>
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>分</SelectLabel>
                  {Array.from({length: 12}, (_, i) => (
                    <SelectItem key={i * 5} value={String(i * 5)}>
                      {String(i * 5).padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SleepCard;
