export type ChartPeriod = "1d" | "7d" | "1m" | "3m" | "6m" | "1y";

export interface KPI {
  id: string;
  title: string;
  value: string;
  trend: number;
  positive?: boolean;
  spark?: number[];
}

export interface MonthlyData {
  month: string;
  sales: number;
  inventory: number;
}

export interface CategoryData {
  label: string;
  value: number;
}

export interface ProductData {
  name: string;
  percent: number;
}

export interface DashboardData {
  kpis: KPI[];
  productKpis: KPI[];
  categoryKpis: KPI[];
  salesAndInventoryTrend: SalesAndInventoryTrend[];
  movement: CategoryData[];
  categories: CategoryData[];
  products: ProductData[];
  employeeKpis: KPI[];
}

export interface MetricTimeRange {
  startDate: Date;
  endDate: Date;
}

export interface SalesAndInventoryTrend {
  date: Date; // e.g. "Jan", "Week 32", "Day 10"
  sales: number;
  inventory: number;
}
