import { useState, useRef, useEffect } from "react";
import { Moon, Sun, BedDouble } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SleepCard from "@/components/SleepCard";

const Index = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [duration, setDuration] = useState("8.0小时");
  const [isSnoring, setIsSnoring] = useState(false);
  const [snoringCount, setSnoringCount] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const calculateDuration = (sleep: string, wake: string) => {
    const [sleepHour, sleepMinute] = sleep.split(':').map(Number);
    const [wakeHour, wakeMinute] = wake.split(':').map(Number);
    
    let hours = wakeHour - sleepHour;
    let minutes = wakeMinute - sleepMinute;
    
    if (hours < 0) hours += 24;
    if (minutes < 0) {
      minutes += 60;
      hours = (hours - 1 + 24) % 24;
    }
    
    const totalHours = hours + (minutes / 60);
    setDuration(`${totalHours.toFixed(1)}小时`);
  };

  const handleSleepTimeChange = (newValue: string) => {
    setSleepTime(newValue);
    calculateDuration(newValue, wakeTime);
  };

  const handleWakeTimeChange = (newValue: string) => {
    setWakeTime(newValue);
    calculateDuration(sleepTime, newValue);
  };

  const startAudioTracking = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      toast({
        title: "开始检测",
        description: "正在监测打呼噜状况",
      });

      detectSnoring();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        variant: "destructive",
        title: "错误",
        description: "无法访问麦克风，请确保已授予麦克风权限。",
      });
    }
  };

  const stopAudioTracking = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    mediaStreamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
  };

  const detectSnoring = () => {
    if (!analyserRef.current || !isTracking) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const checkSnoring = () => {
      if (!isTracking) return;
      
      analyser.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
      
      const isCurrentlySnoring = average > 30;
      
      if (isCurrentlySnoring && !isSnoring) {
        setIsSnoring(true);
        setSnoringCount(prev => prev + 1);
        toast({
          title: "检测到打呼噜",
          description: "已记录一次打呼噜事件",
        });
      } else if (!isCurrentlySnoring && isSnoring) {
        setIsSnoring(false);
      }
      
      requestAnimationFrame(checkSnoring);
    };
    
    checkSnoring();
  };

  useEffect(() => {
    if (isTracking) {
      startAudioTracking();
    } else {
      stopAudioTracking();
      setIsSnoring(false);
    }

    return () => {
      stopAudioTracking();
    };
  }, [isTracking]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sleep-gentle to-sleep-lavender">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sleep-deep animate-float">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-sleep-deep">睡眠质量追踪</h1>
            <p className="text-lg text-sleep-deep/70">追踪并改善您的睡眠质量</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <SleepCard 
              title="就寝时间" 
              value={sleepTime} 
              icon="sleep"
              onValueChange={handleSleepTimeChange}
            />
            <SleepCard 
              title="起床时间" 
              value={wakeTime} 
              icon="wake"
              onValueChange={handleWakeTimeChange}
            />
            <SleepCard 
              title="睡眠时长" 
              value={duration} 
              icon="duration"
              onValueChange={setDuration}
            />
          </div>

          <Card className="p-6 glass-morphism">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-sleep-deep">现在开始追踪</h2>
              <p className="text-sleep-deep/70">
                {isTracking 
                  ? "正在追踪您的睡眠，包括打呼噜检测" 
                  : "点击下方按钮开始追踪您的睡眠和打呼噜情况"}
              </p>
              <Button
                size="lg"
                className="bg-sleep-deep hover:bg-sleep-deep/90 text-white"
                onClick={() => setIsTracking(!isTracking)}
              >
                {isTracking ? "停止追踪" : "开始追踪"}
              </Button>
              {isTracking && (
                <div className="mt-4 text-sleep-deep/70">
                  <p>本次检测到打呼噜次数: {snoringCount}</p>
                  {isSnoring && (
                    <p className="text-sleep-accent font-semibold animate-pulse">
                      正在打呼噜...
                    </p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="p-6 glass-morphism">
              <h3 className="text-xl font-semibold text-sleep-deep mb-4">睡眠提示</h3>
              <ul className="space-y-3 text-sleep-deep/70">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sleep-accent" />
                  保持规律的作息时间
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sleep-accent" />
                  避免睡前使用电子设备
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-sleep-accent" />
                  创���舒适的睡眠环境
                </li>
              </ul>
            </Card>

            <Card className="p-6 glass-morphism">
              <h3 className="text-xl font-semibold text-sleep-deep mb-4">睡眠质量</h3>
              <div className="flex items-center justify-center h-[150px]">
                <div className="text-5xl font-bold text-sleep-accent">85%</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
