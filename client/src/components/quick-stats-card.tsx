import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function QuickStatsCard() {
  const { data: todayStats, isLoading: todayLoading } = useQuery({
    queryKey: ['/api/stats/today'],
  });

  const { data: weekStats, isLoading: weekLoading } = useQuery({
    queryKey: ['/api/stats/week'],
  });

  const { data: prStats, isLoading: prLoading } = useQuery({
    queryKey: ['/api/stats/pr'],
  });

  const isLoading = todayLoading || weekLoading || prLoading;

  if (isLoading) {
    return (
      <Card className="rounded-2xl shadow-sm border border-slate-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {todayStats?.totalReps || 0}
            </div>
            <div className="text-sm text-slate-500">Today</div>
          </div>
          <div className="text-center border-x border-slate-200">
            <div className="text-3xl font-bold text-emerald-600">
              {weekStats?.totalReps || 0}
            </div>
            <div className="text-sm text-slate-500">This Week</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">
              {prStats?.personalRecord || 0}
            </div>
            <div className="text-sm text-slate-500">PR</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
