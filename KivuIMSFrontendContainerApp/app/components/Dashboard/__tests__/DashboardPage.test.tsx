import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DashboardPage from "../DashboardPage";
import { useDashboardData } from "../../../hooks/api/useDashboardData";
import { store } from "../../../store/store";

// 🧩 Mock the API hook
jest.mock("../../../hooks/api/useDashboardData", () => ({
  useDashboardData: jest.fn()
}));

describe("DashboardPage (Real Render)", () => {
  const mockDashboardData = {
    kpis: [
      {
        id: "1",
        title: "Net Revenue",
        value: "$152K",
        trend: 12.4,
        positive: true
      },
      {
        id: "2",
        title: "Gross Profit",
        value: "$65K",
        trend: 4.6,
        positive: true
      },
      {
        id: "3",
        title: "Transactions",
        value: "1,247",
        trend: -1.2,
        positive: false
      }
    ],
    movement: [
      { label: "Inbound", value: 60 },
      { label: "Outbound", value: 40 }
    ],
    categories: [
      { label: "Electronics", value: 40 },
      { label: "Clothing", value: 25 }
    ],
    products: [
      { name: "Product A", percent: 75 },
      { name: "Product B", percent: 25 }
    ]
  };

  beforeEach(() => {
    (useDashboardData as jest.Mock).mockReturnValue(mockDashboardData);
  });

  it("renders dashboard with real components", async () => {
    const theme = createTheme();

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <DashboardPage />
        </ThemeProvider>
      </Provider>
    );

    // ✅ Assert key KPI titles are rendered
    expect(await screen.findByText("Net Revenue")).toBeInTheDocument();
    expect(await screen.findByText("Gross Profit")).toBeInTheDocument();
    expect(await screen.findByText("Transactions")).toBeInTheDocument();
  });
});
