import { TenantConfig, TenantId } from "./types";
import {
  PAGE_PORTAL_ADMIN,
  PAGE_PORTAL_FINANCE,
  PAGE_PORTAL_INVENTORY,
  PAGE_PORTAL_ORDERS,
  PAGE_PORTAL_PEOPLE
} from "../PageRoutes";

export const RemoteTenantConfig: TenantConfig[] = [
  {
    appName: TenantId.INVENTORY_MANAGEMENT,
    isDevOnly: true,
    routes: [
      {
        path: `${PAGE_PORTAL_INVENTORY}/*`,
        module: "InventoryManagementMFE",
        scope: "./inventoryManagement"
      }
    ],
    remoteUrl: "http://localhost:5174/remoteEntry.js"
  },
  {
    appName: TenantId.ORDER_MANAGEMENT,
    isDevOnly: true,
    routes: [
      {
        path: `${PAGE_PORTAL_ORDERS}/*`,
        module: "OrderManagementMFE",
        scope: "./orderManagement"
      }
    ],
    remoteUrl: "http://localhost:5175/remoteEntry.js"
  },
  {
    appName: TenantId.FINANCE_MANAGEMENT,
    isDevOnly: true,
    routes: [
      {
        path: `${PAGE_PORTAL_FINANCE}/*`,
        module: "FinanceManagementMFE",
        scope: "./financeManagement"
      }
    ],
    remoteUrl: "http://localhost:5176/remoteEntry.js"
  },
  {
    appName: TenantId.PEOPLE_MANAGEMENT,
    isDevOnly: true,
    routes: [
      {
        path: `${PAGE_PORTAL_PEOPLE}/*`,
        module: "PeopleManagementMFE",
        scope: "./peopleManagement"
      }
    ],
    remoteUrl: "http://localhost:5177/remoteEntry.js"
  },
  {
    appName: TenantId.ADMIN_MANAGEMENT,
    isDevOnly: true,
    routes: [
      {
        path: `${PAGE_PORTAL_ADMIN}/*`,
        module: "AdminManagementMFE",
        scope: "./adminManagement"
      }
    ],
    remoteUrl: "http://localhost:5178/remoteEntry.js"
  }
];
