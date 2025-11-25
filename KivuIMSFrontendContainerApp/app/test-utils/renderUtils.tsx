import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertBannerProvider from "../providers/AlertBannerProvider";
import AuthProviders from "../providers/AuthProviders";

const queryClient = new QueryClient();

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AlertBannerProvider>
        <AuthProviders>{children}</AuthProviders>
      </AlertBannerProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });
