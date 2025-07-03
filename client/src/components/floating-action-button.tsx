import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FloatingActionButtonProps {
  onLogSuccess: () => void;
}

export function FloatingActionButton({ onLogSuccess }: FloatingActionButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const quickLogMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/log', { reps: 1 });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "1 rep logged successfully!",
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
        description: "Failed to log pull-up. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleQuickLog = () => {
    quickLogMutation.mutate();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleQuickLog}
        disabled={quickLogMutation.isPending}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
