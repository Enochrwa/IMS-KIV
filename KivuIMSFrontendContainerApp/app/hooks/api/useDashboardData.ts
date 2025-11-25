import { DashboardData } from "../../components/Dashboard/types/dashboardTypes";

export const useDashboardData = (): DashboardData => ({
  kpis: [
    {
      id: "rev",
      title: "Net Revenue",
      value: "Rwf 152K",
      trend: 12.4,
      positive: true,
      spark: [105, 112, 120, 125, 130, 138, 152] // steady upward trend
    },
    {
      id: "profit",
      title: "Gross Profit",
      value: "Rwf 65K",
      trend: 4.6,
      positive: true,
      spark: [60, 61, 62, 63, 64, 65, 66] // gentle increase
    },
    {
      id: "tx",
      title: "Transactions",
      value: "1,247",
      trend: -1.2,
      positive: false,
      spark: [1320, 1290, 1280, 1275, 1260, 1250, 1247] // small downward dip
    },
    {
      id: "margin",
      title: "Gross Profit Margin",
      value: "69.1%",
      trend: 3.1,
      positive: true,
      spark: [63, 64, 65, 67, 68, 69, 69.1]
    },
    {
      id: "aov",
      title: "Average Order Volume",
      value: "Rwf 208",
      trend: 12.0,
      positive: true,
      spark: [180, 185, 190, 195, 200, 205, 208]
    },
    {
      id: "products",
      title: "Products Sold",
      value: "270",
      trend: 2.0,
      positive: true,
      spark: [240, 245, 250, 255, 260, 265, 270]
    }
  ],
  productKpis: [
    {
      id: "total_products",
      title: "Total Products",
      value: "120K",
      trend: 2.0,
      positive: true
    },
    {
      id: "low_stock_products",
      title: "Low Stock Products",
      value: "2,435",
      trend: -1.8,
      positive: false
    },
    {
      id: "out_of_stock_products",
      title: "Out of Stock Products",
      value: "34",
      trend: 2.1,
      positive: true,
      spark: [20, 63, 64, 65, 67, 68, 69, 69.1]
    },
    {
      id: "most_stock_products",
      title: "Most Stock Products",
      value: "19",
      trend: 1.5,
      positive: true,
      spark: [80, 185, 190, 195, 200]
    }
  ],
  employeeKpis: [
    {
      id: "total_employee",
      title: "Total",
      value: "12",
      trend: 2.0,
      positive: true
    },
    {
      id: "active_employee",
      title: "Active",
      value: "8",
      trend: -1.8,
      positive: false
    },
    {
      id: "inactive_employee",
      title: "Inactive",
      value: "2",
      trend: 0.3,
      positive: true,
      spark: [0, 1, 2]
    },
    {
      id: "suspended_employee",
      title: "Suspended",
      value: "19",
      trend: 0.4,
      positive: true,
      spark: [0, 1, 2]
    }
  ],
  categoryKpis: [
    {
      id: "total_categories",
      title: "Total Categories",
      value: "50",
      trend: 1.2,
      positive: true
    },
    {
      id: "active_categories",
      title: "Active Categories",
      value: "45",
      trend: 0.3,
      positive: true
    },
    {
      id: "deleted_categories",
      title: "Deleted Categories",
      value: "5",
      trend: 0.2,
      positive: true
    }
  ],
  salesAndInventoryTrend: [
    { date: new Date("2025-01-01"), sales: 4000, inventory: 2400 },
    { date: new Date("2025-02-01"), sales: 3000, inventory: 3100 },
    { date: new Date("2025-03-01"), sales: 4200, inventory: 2800 },
    { date: new Date("2025-04-01"), sales: 4600, inventory: 3200 },
    { date: new Date("2025-05-01"), sales: 5100, inventory: 3400 },
    { date: new Date("2025-06-01"), sales: 4800, inventory: 3600 },
    { date: new Date("2025-07-01"), sales: 5300, inventory: 3700 },
    { date: new Date("2025-08-01"), sales: 5500, inventory: 3900 },
    { date: new Date("2025-09-01"), sales: 5900, inventory: 4000 },
    { date: new Date("2025-10-01"), sales: 6100, inventory: 4100 },
    { date: new Date("2025-11-01"), sales: 6300, inventory: 4200 }
  ],
  movement: [
    { label: "Musanze Store", value: 40 },
    { label: "Karongi Store", value: 25 },
    { label: "Muhanga Store", value: 20 },
    { label: "Gisenti Store", value: 15 }
  ],
  categories: [
    { label: "Beverages", value: 35 },
    { label: "Snacks", value: 30 },
    { label: "Tobacco", value: 20 },
    { label: "Accessories", value: 15 }
  ],
  products: [
    { name: "Disposable Vape", percent: 28 },
    { name: "Hookah", percent: 22 },
    { name: "Rolling Papers", percent: 18 },
    { name: "Cigars", percent: 16 },
    { name: "Cigarettes", percent: 10 }
  ]
});
