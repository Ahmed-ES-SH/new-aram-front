import type React from "react";
// Type definitions for dashboard components

export interface StatCard {
  id: string;
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface UserChartData {
  month: string;
  users: number;
}

export interface ServicesChartData {
  service: string;
  usage: number;
}

export interface CenterDistribution {
  name: string;
  value: number;
  color: string;
}

export interface Promoter {
  id: string;
  name: string;
  sales: number;
  avatar: string;
  trend: number[];
}

export interface Activity {
  id: string;
  type: "user" | "service" | "message" | "notification";
  title: string;
  time: string;
  icon: React.ReactNode;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  priority: "high" | "medium" | "low";
  created_at?: string;
  updated_at?: string;
}
