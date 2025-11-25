import React from "react";
import {
  AdminPanelSettingsOutlined,
  Category,
  Feed,
  GridView,
  Hail,
  Inventory,
  PaymentOutlined,
  PeopleOutline,
  Person,
  PriceCheck,
  RealEstateAgentOutlined,
  Receipt,
  Settings,
  Shop2Outlined,
  ShoppingBag,
  ShoppingCart,
  ShowChart,
  StoreOutlined
} from "@mui/icons-material";
import {
  PAGE_PORTAL_DASHBOARD,
  PAGE_PORTAL_INVENTORY,
  PAGE_PORTAL_INVENTORY_PRODUCT,
  PAGE_PORTAL_INVENTORY_CATEGORIES,
  PAGE_PORTAL_INVENTORY_STOCK,
  PAGE_PORTAL_INVENTORY_SUPPLIERS,
  PAGE_PORTAL_ORDERS,
  PAGE_PORTAL_ORDERS_PURCHASE,
  PAGE_PORTAL_ORDERS_SALES,
  PAGE_PORTAL_FINANCE,
  PAGE_PORTAL_FINANCE_PAYMENTS,
  PAGE_PORTAL_FINANCE_INVOICES,
  PAGE_PORTAL_PEOPLE_EMPLOYEES,
  PAGE_PORTAL_PROFILE,
  PAGE_PORTAL_ADMIN,
  PAGE_PORTAL_ADMIN_SETTINGS,
  PAGE_PORTAL_ADMIN_LOGS,
  PAGE_PORTAL_COMPANY,
  PORTAL_PREFIX
} from "../../../PageRoutes"; // adjust path as needed

const SideBarMenuItems = [
  {
    label: "Overview",
    icon: <GridView />,
    path: `${PORTAL_PREFIX}/${PAGE_PORTAL_DASHBOARD}`
  },
  {
    label: "Inventory",
    icon: <Inventory />,
    path: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY}`,
    items: [
      {
        label: "Products",
        icon: <ShoppingCart />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_PRODUCT}`
      },
      {
        label: "Categories",
        icon: <Category />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_CATEGORIES}`
      },
      {
        label: "Stock Levels",
        icon: <ShowChart />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_STOCK}`
      },
      {
        label: "Suppliers",
        icon: <PeopleOutline />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_INVENTORY_SUPPLIERS}`
      }
    ]
  },
  {
    label: "Orders",
    icon: <ShoppingBag />,
    path: `${PORTAL_PREFIX}/${PAGE_PORTAL_ORDERS}`,
    items: [
      {
        label: "Purchase Orders",
        icon: <Shop2Outlined />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_ORDERS_PURCHASE}`
      },
      {
        label: "Sales Orders",
        icon: <RealEstateAgentOutlined />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_ORDERS_SALES}`
      }
    ]
  },
  {
    label: "Finance",
    icon: <PriceCheck />,
    path: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE}`,
    items: [
      {
        label: "Payments",
        icon: <PaymentOutlined />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE_PAYMENTS}`
      },
      {
        label: "Invoices",
        icon: <Receipt />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_FINANCE_INVOICES}`
      }
    ]
  },
  {
    label: "Administration",
    icon: <Settings />,
    path: `${PORTAL_PREFIX}/${PAGE_PORTAL_ADMIN}`,
    items: [
      {
        label: "Profile",
        icon: <Person />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_PROFILE}`
      },
      {
        label: "Company",
        icon: <StoreOutlined />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_COMPANY}`
      },
      {
        label: "Employees",
        icon: <Hail />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_PEOPLE_EMPLOYEES}`
      },
      {
        label: "System Settings",
        icon: <AdminPanelSettingsOutlined />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_ADMIN_SETTINGS}`
      },
      {
        label: "Audit Logs",
        icon: <Feed />,
        path: `${PORTAL_PREFIX}/${PAGE_PORTAL_ADMIN_LOGS}`
      }
    ]
  }
];

export default SideBarMenuItems;
