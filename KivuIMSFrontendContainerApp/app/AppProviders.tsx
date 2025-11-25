import React, { type FC, type ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AlertBannerProvider from "./providers/AlertBannerProvider";
import AuthProviders from "./providers/AuthProviders";
import { KivunovaI18nProvider } from "./providers/KivunovaI18nProvider";
import { Provider } from "react-redux";
import { store } from "./store/store";

const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <KivunovaI18nProvider>
              <AlertBannerProvider>
                <AuthProviders>{children}</AuthProviders>
              </AlertBannerProvider>
            </KivunovaI18nProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

export default AppProviders;
