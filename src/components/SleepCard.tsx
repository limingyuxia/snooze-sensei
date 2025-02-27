
import { Card } from "@/components/ui/card";
import { Moon, Sun, BedDouble } from "lucide-react";

interface SleepCardProps {
  title: string;
  value: string;
  icon: "sleep" | "wake" | "duration";
}

const SleepCard = ({ title, value, icon }: SleepCardProps) => {
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

  return (
    <Card className="p-6 card-hover">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-sleep-lavender/30">
          {getIcon()}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-sleep-deep">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default SleepCard;
