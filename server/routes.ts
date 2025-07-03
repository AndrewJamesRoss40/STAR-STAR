import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPullupLogSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || ""
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Log pull-up with timestamp
  app.post('/api/log', async (req, res) => {
    try {
      const validatedData = insertPullupLogSchema.parse(req.body);
      const log = await storage.createPullupLog(validatedData);
      res.json({ status: 'logged', log });
    } catch (error) {
      res.status(400).json({ error: 'Invalid request data' });
    }
  });

  // Get all logs
  app.get('/api/logs', async (req, res) => {
    try {
      const logs = await storage.getPullupLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch logs' });
    }
  });

  // Get today's stats
  app.get('/api/stats/today', async (req, res) => {
    try {
      const totalReps = await storage.getTotalRepsToday();
      const logs = await storage.getPullupLogsToday();
      res.json({ totalReps, logs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch today\'s stats' });
    }
  });

  // Get weekly stats
  app.get('/api/stats/week', async (req, res) => {
    try {
      const totalReps = await storage.getTotalRepsThisWeek();
      const logs = await storage.getPullupLogsThisWeek();
      res.json({ totalReps, logs });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weekly stats' });
    }
  });

  // Get personal record
  app.get('/api/stats/pr', async (req, res) => {
    try {
      const pr = await storage.getPersonalRecord();
      res.json({ personalRecord: pr });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch personal record' });
    }
  });

  // Export formatted data for ChatGPT
  app.get('/api/export', async (req, res) => {
    try {
      const exportText = await buildExportText();
      res.json({ export: exportText });
    } catch (error) {
      res.status(500).json({ error: 'Failed to build export text' });
    }
  });

  // Send summary to OpenAI GPT-4o
  app.post('/api/send-to-gpt', async (req, res) => {
    try {
      const gptReply = await sendToChatGPT();
      res.json({ reply: gptReply });
    } catch (error) {
      console.error('Error sending to GPT:', error);
      res.status(500).json({ error: 'Failed to send to GPT' });
    }
  });

  // Scheduled job for daily auto-export to GPT
  app.get('/api/cron-send-daily', async (req, res) => {
    try {
      const gptReply = await sendToChatGPT();
      console.log('✅ Daily export sent to ChatGPT.');
      res.json({ message: 'Daily export sent to ChatGPT.', reply: gptReply });
    } catch (error) {
      console.error('❌ Daily GPT export failed:', error);
      res.status(500).json({ error: 'Daily GPT export failed.' });
    }
  });

  // Fitness Assistant API endpoints
  app.post('/api/fitness-assistant/analyze', async (req, res) => {
    try {
      const { spawn } = require('child_process');
      
      // Get current workout data
      const logs = await storage.getPullupLogs();
      const todayStats = await storage.getTotalRepsToday();
      const weekStats = await storage.getTotalRepsThisWeek();
      const personalRecord = await storage.getPersonalRecord();
      
      const workoutData = {
        date: new Date().toISOString().split('T')[0],
        total_reps_today: todayStats,
        total_reps_week: weekStats,
        personal_record: personalRecord,
        recent_logs: logs.slice(-10).map(log => ({
          time: new Date(log.timestamp).toLocaleTimeString(),
          reps: log.reps
        }))
      };
      
      // Call Python fitness coach
      const python = spawn('python3', [
        'fitness_coach.py',
        'analyze',
        JSON.stringify(workoutData)
      ]);
      
      let output = '';
      let error = '';
      
      python.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      python.on('close', (code) => {
        if (code === 0) {
          res.json({ 
            analysis: output.trim(),
            workout_data: workoutData
          });
        } else {
          console.error('Python error:', error);
          res.status(500).json({ error: 'Failed to get fitness analysis' });
        }
      });
      
    } catch (error) {
      console.error('Error calling fitness assistant:', error);
      res.status(500).json({ error: 'Failed to analyze workout data' });
    }
  });

  app.post('/api/fitness-assistant/nutrition', async (req, res) => {
    try {
      const { spawn } = require('child_process');
      
      const clientStats = {
        age: 62,
        height: "5'10\"",
        current_weight: 172,
        goal_weight: 152,
        activity_level: "active",
        goal: "lose 20 lbs while maximizing lean muscle mass"
      };
      
      // Call Python fitness coach for nutrition advice
      const python = spawn('python3', [
        'fitness_coach.py',
        'nutrition',
        JSON.stringify(clientStats)
      ]);
      
      let output = '';
      let error = '';
      
      python.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      python.on('close', (code) => {
        if (code === 0) {
          res.json({ 
            nutrition_advice: output.trim(),
            client_stats: clientStats
          });
        } else {
          console.error('Python error:', error);
          res.status(500).json({ error: 'Failed to get nutrition advice' });
        }
      });
      
    } catch (error) {
      console.error('Error calling fitness assistant:', error);
      res.status(500).json({ error: 'Failed to get nutrition advice' });
    }
  });

  // Helper: build export text
  async function buildExportText(): Promise<string> {
    const logs = await storage.getPullupLogs();
    const totalReps = logs.reduce((sum, log) => sum + log.reps, 0);
    
    const formattedLogs = logs.map(log => {
      const time = log.timestamp.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      return `- ${time} → ${log.reps} reps`;
    });

    const today = new Date().toISOString().slice(0, 10);
    return `Project: Personal Fitness\nDate: ${today}\nPull-up Log:\n${formattedLogs.join("\n")}\nTotal: ${totalReps} reps`;
  }

  // Helper: send to GPT
  async function sendToChatGPT(): Promise<string> {
    const exportText = await buildExportText();

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: 'system', 
          content: 'You are a fitness coach analyzing pull-up workout data. Provide encouraging feedback, identify patterns, and suggest improvements. Keep responses concise and actionable.' 
        },
        { role: 'user', content: exportText }
      ]
    });

    return response.choices[0].message.content || 'No response from GPT';
  }

  const httpServer = createServer(app);
  return httpServer;
}
