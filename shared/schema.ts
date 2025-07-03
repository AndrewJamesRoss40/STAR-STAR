import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pullupLogs = pgTable("pullup_logs", {
  id: serial("id").primaryKey(),
  reps: integer("reps").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPullupLogSchema = createInsertSchema(pullupLogs).pick({
  reps: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type PullupLog = typeof pullupLogs.$inferSelect;
export type InsertPullupLog = z.infer<typeof insertPullupLogSchema>;
