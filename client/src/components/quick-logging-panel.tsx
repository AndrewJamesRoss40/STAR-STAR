import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Plus, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuickLoggingPanelProps {
  onLogSuccess: () => void;
}

export function QuickLoggingPanel({ onLogSuccess }: QuickLoggingPanelProps) {
  const [customReps, setCustomReps] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logMutation = useMutation({
    mutationFn: async (reps: number) => {
      const response = await apiRequest('POST', '/api/log', { reps });
      return response.json();
    },
    onSuccess: (data, reps) => {
      toast({
        title: "Success!",
        description: `${reps} rep${reps > 1 ? 's' : ''} logged successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/today'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/week'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats/pr'] });
      queryClient.invalidateQueries({ queryKey: ['/api/logs'] });
      onLogSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log pull-ups. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLogReps = (reps: number) => {
    logMutation.mutate(reps);
  };

  const handleLogCustomReps = () => {
    const reps = parseInt(customReps);
    if (isNaN(reps) || reps <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number of reps.",
        variant: "destructive",
      });
      return;
    }
    handleLogReps(reps);
    setCustomReps("");
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
          <PlusCircle className="text-blue-500 mr-2 h-5 w-5" />
          Quick Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleLogReps(1)}
            disabled={logMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            +1 Rep
          </Button>
          <Button
            onClick={() => handleLogReps(5)}
            disabled={logMutation.isPending}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            +5 Reps
          </Button>
        </div>

        <div className="flex space-x-3">
          <Input
            type="number"
            placeholder="Custom reps..."
            value={customReps}
            onChange={(e) => setCustomReps(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            min="1"
          />
          <Button
            onClick={handleLogCustomReps}
            disabled={logMutation.isPending || !customReps}
            className="bg-slate-600 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Check className="mr-2 h-4 w-4" />
            Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
