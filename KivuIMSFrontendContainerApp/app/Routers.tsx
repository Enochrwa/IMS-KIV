import React from "react";
import { Route, Routes } from "react-router-dom";
import { RemoteTenantConfig } from "./TenantConfig/config";
import Welcome from "./components/Welcome";
import {
  PAGE_PORTAL_COMPANY,
  PAGE_PORTAL_INVENTORY_CATEGORIES,
  PAGE_PORTAL_INVENTORY_PRODUCT,
  PAGE_PORTAL_PEOPLE_EMPLOYEES,
  PAGE_PORTAL_PROFILE,
  PAGE_ROUTE_FORGOT_PASSWORD,
  PAGE_ROUTE_LOGIN,
  PAGE_ROUTE_REGISTRATION
} from "./PageRoutes";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import ForgotPasswordWrapper from "./components/ForgotPassword/ForgotPasswordWrapper";
import UserProfile from "./components/Profile/UserProfile";
import RemoteComponent from "./components/RemoteComponent/RemoteComponent";
import LanguageLayout from "./components/LanguageLayout";
import AppShell from "./components/AppShell/AppShell";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import CompanyView from "./components/Company/CompanyView";
import ProductList from "./components/Products/ProductList";
import ProductDetailPage from "./components/Products/ProductDetailPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import CategoryList from "./components/Category/CategoryList";
import EmployeeList from "./components/Employees/EmployeeList";
import EmployeeDetailPage from "./components/Employees/EmployeeDetailPage";

const Routers = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Wrap language-specific routing */}
        <Route path="/:lang?" element={<LanguageLayout />}>
          {/* Public routes */}
          <Route index element={<Welcome />} />
          <Route path={PAGE_ROUTE_LOGIN} element={<Login />} />
          <Route path={PAGE_ROUTE_REGISTRATION} element={<Registration />} />
          <Route
            path={PAGE_ROUTE_FORGOT_PASSWORD}
            element={<ForgotPasswordWrapper />}
          />

          <Route
            path={PAGE_ROUTE_FORGOT_PASSWORD}
            element={<ForgotPasswordWrapper />}
          />

          {/* Authenticated / portal routes */}
          <Route path="portal" element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            {/* ✅ Nested inside AppShell via <Outlet> */}
            <Route path={PAGE_PORTAL_PROFILE} element={<UserProfile />} />
            <Route path={PAGE_PORTAL_COMPANY} element={<CompanyView />} />
            <Route
              path={PAGE_PORTAL_INVENTORY_PRODUCT}
              element={<ProductList />}
            />
            <Route
              path={PAGE_PORTAL_PEOPLE_EMPLOYEES}
              element={<EmployeeList />}
            />
            <Route
              path={`${PAGE_PORTAL_PEOPLE_EMPLOYEES}/:employeeId`}
              element={<EmployeeDetailPage />}
            />
            <Route
              path={PAGE_PORTAL_INVENTORY_CATEGORIES}
              element={<CategoryList />}
            />
            <Route
              path={`inventory/products/:productId`}
              element={<ProductDetailPage />}
            />

            {/* Dynamic remote routes */}
            {RemoteTenantConfig.filter((t) => !t.isDevOnly).flatMap((tenant) =>
              tenant.routes.map((r) => (
                <Route
                  key={`${tenant.appName}-${r.path}`}
                  path={r.path}
                  element={
                    <RemoteComponent
                      scope={r.scope}
                      module={r.module}
                      url={tenant.remoteUrl}
                    />
                  }
                />
              ))
            )}
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<div>Page not found!</div>} />
      </Routes>
    </ErrorBoundary>
  );
};

export default Routers;
