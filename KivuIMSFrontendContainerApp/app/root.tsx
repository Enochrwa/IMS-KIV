import React from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { RouteErrorBoundary } from "./components/common/RouteErrorBoundary";

import type { Route } from "./+types/root";
import "./app.css";
import { AuthProvider } from "./providers/AuthProvider";

import { CustomThemeProvider } from "./contexts/ThemeContext";
import { CssBaseline } from "@mui/material";

// React Query imports
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1
    }
  }
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <CustomThemeProvider>
              <CssBaseline />
              <AuthProvider>{children}</AuthProvider>
            </CustomThemeProvider>
          </Provider>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

export { Layout };

const App = () => {
  return <Outlet />;
};

export default App;

const HydrateFallback = () => {
  return null;
};

export { HydrateFallback };

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  return (
    <Layout>
      <RouteErrorBoundary error={error} />
    </Layout>
  );
};
