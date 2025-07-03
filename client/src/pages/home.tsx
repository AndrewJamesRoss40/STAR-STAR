import { useState } from "react";
import { Settings, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickStatsCard } from "@/components/quick-stats-card";
import { QuickLoggingPanel } from "@/components/quick-logging-panel";
import { ProgressChart } from "@/components/progress-chart";
import { ChatGPTAnalysisPanel } from "@/components/chatgpt-analysis-panel";
import { RecentLogsPanel } from "@/components/recent-logs-panel";
import { GoalsAndStreaks } from "@/components/goals-and-streaks";
import { FloatingActionButton } from "@/components/floating-action-button";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-xl">
                <Dumbbell className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Pull-Up Tracker</h1>
                <p className="text-sm text-slate-500">Today, {currentDate}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-lg">
              <Settings className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <QuickStatsCard key={`stats-${refreshKey}`} />
        <QuickLoggingPanel onLogSuccess={handleLogSuccess} />
        <ProgressChart key={`chart-${refreshKey}`} />
        <ChatGPTAnalysisPanel />
        <RecentLogsPanel key={`logs-${refreshKey}`} />
        <GoalsAndStreaks key={`goals-${refreshKey}`} />
      </main>

      <FloatingActionButton onLogSuccess={handleLogSuccess} />
    </div>
  );
}
