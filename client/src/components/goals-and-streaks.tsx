import { useQuery } from "@tanstack/react-query";
import { Target, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export function GoalsAndStreaks() {
  const { data: todayStats, isLoading } = useQuery({
    queryKey: ['/api/stats/today'],
  });

  const { data: logs } = useQuery({
    queryKey: ['/api/logs'],
  });

  const dailyGoal = 15;
  const todayReps = todayStats?.totalReps || 0;
  const goalProgress = Math.min((todayReps / dailyGoal) * 100, 100);

  // Calculate streak
  const calculateStreak = () => {
    if (!logs || logs.length === 0) return { current: 0, best: 0 };
    
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    // Group by day
    const dailyLogs = new Map<string, number>();
    sortedLogs.forEach(log => {
      const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
      dailyLogs.set(dateKey, (dailyLogs.get(dateKey) || 0) + log.reps);
    });
    
    const days = Array.from(dailyLogs.keys()).sort().reverse();
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate current streak
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const daysBetween = Math.floor((new Date(today).getTime() - new Date(day).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysBetween === i) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Calculate best streak
    for (let i = 0; i < days.length; i++) {
      if (i === 0 || Math.floor((new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / (1000 * 60 * 60 * 24)) === 1) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    
    return { current: currentStreak, best: bestStreak };
  };

  const streak = calculateStreak();

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm border border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <Target className="text-red-500 mr-2 h-5 w-5" />
            Goals & Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-10" />
              </div>
              <Skeleton className="h-8 w-24 mb-1" />
              <Skeleton className="h-2 w-full" />
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <Target className="text-red-500 mr-2 h-5 w-5" />
          Goals & Streaks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Goal */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">Daily Goal</span>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {Math.round(goalProgress)}%
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {todayReps} / {dailyGoal}
            </div>
            <Progress 
              value={goalProgress} 
              className="h-2 bg-blue-200"
            />
          </div>

          {/* Current Streak */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">Current Streak</span>
              <Flame className="text-orange-500 h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {streak.current} day{streak.current !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-emerald-600">
              Best: {streak.best} day{streak.best !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
