import { useQuery } from "@tanstack/react-query";
import { History, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type PullupLog = {
  id: number;
  reps: number;
  timestamp: string;
};

export function RecentLogsPanel() {
  const { data: logs, isLoading } = useQuery<PullupLog[]>({
    queryKey: ['/api/logs'],
  });

  const recentLogs = logs?.slice(0, 5) || [];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const logTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - logTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - logTime.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
    }
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm border border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <History className="text-slate-500 mr-2 h-5 w-5" />
              Recent Logs
            </CardTitle>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <History className="text-slate-500 mr-2 h-5 w-5" />
            Recent Logs
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentLogs.length > 0 ? (
          <div className="space-y-3">
            {recentLogs.map((log, index) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? 'bg-blue-100' :
                    index === 1 ? 'bg-emerald-100' :
                    'bg-amber-100'
                  }`}>
                    <Dumbbell className={`h-4 w-4 ${
                      index === 0 ? 'text-blue-600' :
                      index === 1 ? 'text-emerald-600' :
                      'text-amber-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">
                      {log.reps} rep{log.reps !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-slate-500">
                      {formatTimeAgo(log.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {formatTime(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Dumbbell className="text-slate-400 h-12 w-12 mx-auto mb-2" />
            <p className="text-slate-500">No logs yet</p>
            <p className="text-sm text-slate-400">Start logging your pull-ups to see them here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
