import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type PullupLog = {
  id: number;
  reps: number;
  timestamp: string;
};

export function ProgressChart() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  
  const { data: logs, isLoading } = useQuery<PullupLog[]>({
    queryKey: ['/api/logs'],
  });

  const processChartData = () => {
    if (!logs || logs.length === 0) return [];

    const sortedLogs = [...logs].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (viewMode === 'daily') {
      // Group by day and sum reps
      const dailyData = new Map<string, number>();
      sortedLogs.forEach(log => {
        const date = new Date(log.timestamp).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        dailyData.set(date, (dailyData.get(date) || 0) + log.reps);
      });

      return Array.from(dailyData.entries())
        .slice(-7) // Last 7 days
        .map(([date, reps]) => ({ date, reps }));
    } else {
      // Group by week
      const weeklyData = new Map<string, number>();
      sortedLogs.forEach(log => {
        const date = new Date(log.timestamp);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + log.reps);
      });

      return Array.from(weeklyData.entries())
        .slice(-4) // Last 4 weeks
        .map(([date, reps]) => ({ date, reps }));
    }
  };

  const chartData = processChartData();
  const maxReps = Math.max(...chartData.map(d => d.reps), 0);

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <TrendingUp className="text-emerald-500 mr-2 h-5 w-5" />
              Progress Chart
            </CardTitle>
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <TrendingUp className="text-emerald-500 mr-2 h-5 w-5" />
            Progress Chart
          </CardTitle>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={viewMode === 'daily' ? 'default' : 'outline'}
              onClick={() => setViewMode('daily')}
              className="px-3 py-1 text-sm rounded-lg font-medium"
            >
              Daily
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'weekly' ? 'default' : 'outline'}
              onClick={() => setViewMode('weekly')}
              className="px-3 py-1 text-sm rounded-lg font-medium"
            >
              Weekly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-sm" />
                <YAxis className="text-sm" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="reps" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center">
              <BarChart3 className="text-slate-400 h-8 w-8 mx-auto mb-2" />
              <p className="text-slate-500">No data available</p>
              <p className="text-sm text-slate-400">Start logging to see your progress</p>
            </div>
          </div>
        )}

        {/* Progress bars for recent days */}
        <div className="mt-4 space-y-2">
          {chartData.slice(-3).map((day, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-slate-600 w-16">{day.date}</span>
              <div className="flex-1 mx-3 bg-slate-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-amber-500' : 
                    index === 1 ? 'bg-emerald-500' : 
                    'bg-blue-500'
                  }`}
                  style={{ width: `${maxReps > 0 ? (day.reps / maxReps) * 100 : 0}%` }}
                />
              </div>
              <span className="text-slate-800 font-medium w-8">{day.reps}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
