import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Brain, Download, Clock, CheckCircle, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function ChatGPTAnalysisPanel() {
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>("");
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/send-to-gpt');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.reply);
      setAnalysisTimestamp(new Date().toLocaleString());
      toast({
        title: "Analysis Complete!",
        description: "Your AI feedback is ready.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('GET', '/api/export');
      return response.json();
    },
    onSuccess: (data) => {
      // For mobile browsers, show the data instead of trying clipboard
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(data.export).then(() => {
          toast({
            title: "Exported!",
            description: "Progress data copied to clipboard.",
          });
        }).catch(() => {
          // Fallback: show data for manual copy
          setAnalysisResult(`EXPORT DATA:\n\n${data.export}`);
          setAnalysisTimestamp(new Date().toLocaleString());
          toast({
            title: "Export Ready",
            description: "Data displayed below - tap and hold to copy.",
          });
        });
      } else {
        // Mobile fallback: display data for manual copy
        setAnalysisResult(`EXPORT DATA:\n\n${data.export}`);
        setAnalysisTimestamp(new Date().toLocaleString());
        toast({
          title: "Export Ready",
          description: "Data displayed below - tap and hold to copy.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const fitnessAnalysisMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/fitness-assistant/analyze');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
      setAnalysisTimestamp(new Date().toLocaleString());
      toast({
        title: "Analysis Complete",
        description: "Your fitness specialist has analyzed your workout data.",
      });
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to get fitness analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const nutritionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/fitness-assistant/nutrition');
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysisResult(data.nutrition_advice);
      setAnalysisTimestamp(new Date().toLocaleString());
      toast({
        title: "Nutrition Advice Ready",
        description: "Your nutrition specialist has provided personalized advice.",
      });
    },
    onError: () => {
      toast({
        title: "Nutrition Analysis Failed",
        description: "Failed to get nutrition advice. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    analysisMutation.mutate();
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleFitnessAnalysis = () => {
    fitnessAnalysisMutation.mutate();
  };

  const handleNutritionAdvice = () => {
    nutritionMutation.mutate();
  };

  return (
    <Card className="rounded-2xl shadow-sm border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
            <Bot className="text-purple-500 mr-2 h-5 w-5" />
            AI Analysis
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAnalyze}
              disabled={analysisMutation.isPending}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Brain className="mr-2 h-4 w-4" />
              {analysisMutation.isPending ? "Analyzing..." : "Basic Analysis"}
            </Button>
            <Button
              onClick={handleFitnessAnalysis}
              disabled={fitnessAnalysisMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Brain className="mr-2 h-4 w-4" />
              {fitnessAnalysisMutation.isPending ? "Analyzing..." : "Fitness Coach"}
            </Button>
            <Button
              onClick={handleNutritionAdvice}
              disabled={nutritionMutation.isPending}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Brain className="mr-2 h-4 w-4" />
              {nutritionMutation.isPending ? "Loading..." : "Nutrition"}
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportMutation.isPending}
              variant="outline"
              className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="min-h-24">
          {(analysisMutation.isPending || fitnessAnalysisMutation.isPending || nutritionMutation.isPending) ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-slate-600">
                {analysisMutation.isPending && "Analyzing your progress..."}
                {fitnessAnalysisMutation.isPending && "Your fitness coach is analyzing your data..."}
                {nutritionMutation.isPending && "Getting personalized nutrition advice..."}
              </span>
            </div>
          ) : analysisResult ? (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Bot className="text-white h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">AI Feedback</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {analysisResult}
                  </p>
                  <div className="mt-3 flex items-center text-sm text-slate-500">
                    <Clock className="mr-1 h-3 w-3" />
                    <span>{analysisTimestamp}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
              <Lightbulb className="text-slate-400 h-6 w-6 mx-auto mb-2" />
              <p className="text-slate-500 mb-2">Get personalized insights about your pull-up progress</p>
              <p className="text-sm text-slate-400">Click "Get Analysis" to receive AI-powered feedback and recommendations</p>
            </div>
          )}
        </div>

        {/* Auto-export status */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-500">
              <Clock className="mr-2 h-4 w-4" />
              <span>Auto-export scheduled for 9:00 PM daily</span>
            </div>
            <div className="flex items-center text-emerald-600">
              <CheckCircle className="mr-1 h-3 w-3" />
              <span>System active</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
