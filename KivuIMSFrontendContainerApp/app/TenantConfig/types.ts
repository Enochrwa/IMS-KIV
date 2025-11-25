export enum TenantId {
  INVENTORY_MANAGEMENT = "inventoryManagement",
  ORDER_MANAGEMENT = "orderManagement",
  FINANCE_MANAGEMENT = "financeManagement",
  PEOPLE_MANAGEMENT = "peopleManagement",
  ADMIN_MANAGEMENT = "adminManagement"
}

export interface TenantRoutes {
  path: string; // react-router path (/dashboard/*, /profile, etc.)
  module: string; // exposed module (./DashboardApp, ./ProfileApp, etc.)
  scope: string; // remote container name (dashboardMFE, profileMFE)
}

export interface TenantConfig {
  appName: TenantId; // some ID or enum for tenant
  isDevOnly: boolean; // if true, don’t include in prod
  routes: TenantRoutes[];
  remoteUrl: string; // base remoteEntry.js URL
}
