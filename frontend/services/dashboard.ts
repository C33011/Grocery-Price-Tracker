import { apiRequest } from "@/lib/api";
import type { DashboardData } from "@/types/dashboard";

export function getDashboard(): Promise<DashboardData> {
  return apiRequest<DashboardData>("/api/dashboard");
}
