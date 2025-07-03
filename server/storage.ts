import { users, pullupLogs, type User, type InsertUser, type PullupLog, type InsertPullupLog } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Pull-up log methods
  createPullupLog(log: InsertPullupLog): Promise<PullupLog>;
  getPullupLogs(): Promise<PullupLog[]>;
  getPullupLogsToday(): Promise<PullupLog[]>;
  getPullupLogsThisWeek(): Promise<PullupLog[]>;
  getTotalRepsToday(): Promise<number>;
  getTotalRepsThisWeek(): Promise<number>;
  getPersonalRecord(): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private pullupLogs: Map<number, PullupLog>;
  private currentUserId: number;
  private currentLogId: number;

  constructor() {
    this.users = new Map();
    this.pullupLogs = new Map();
    this.currentUserId = 1;
    this.currentLogId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPullupLog(insertLog: InsertPullupLog): Promise<PullupLog> {
    const id = this.currentLogId++;
    const log: PullupLog = { 
      ...insertLog, 
      id, 
      timestamp: new Date()
    };
    this.pullupLogs.set(id, log);
    return log;
  }

  async getPullupLogs(): Promise<PullupLog[]> {
    return Array.from(this.pullupLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getPullupLogsToday(): Promise<PullupLog[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return Array.from(this.pullupLogs.values())
      .filter(log => log.timestamp >= today && log.timestamp < tomorrow)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getPullupLogsThisWeek(): Promise<PullupLog[]> {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    return Array.from(this.pullupLogs.values())
      .filter(log => log.timestamp >= weekStart)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getTotalRepsToday(): Promise<number> {
    const todayLogs = await this.getPullupLogsToday();
    return todayLogs.reduce((total, log) => total + log.reps, 0);
  }

  async getTotalRepsThisWeek(): Promise<number> {
    const weekLogs = await this.getPullupLogsThisWeek();
    return weekLogs.reduce((total, log) => total + log.reps, 0);
  }

  async getPersonalRecord(): Promise<number> {
    const allLogs = await this.getPullupLogs();
    if (allLogs.length === 0) return 0;
    
    // Group by day and sum up daily totals
    const dailyTotals = new Map<string, number>();
    allLogs.forEach(log => {
      const dateKey = log.timestamp.toISOString().split('T')[0];
      dailyTotals.set(dateKey, (dailyTotals.get(dateKey) || 0) + log.reps);
    });
    
    return Math.max(...Array.from(dailyTotals.values()));
  }
}

export const storage = new MemStorage();
