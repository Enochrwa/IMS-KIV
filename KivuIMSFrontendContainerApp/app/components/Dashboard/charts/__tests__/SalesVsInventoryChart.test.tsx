import React from "react";
import { render, screen } from "@testing-library/react";
import SalesVsInventoryTrend from "../SalesVsInventoryChart";
import {
  SalesAndInventoryTrend,
  MetricTimeRange
} from "../../types/dashboardTypes";

// Freeze date/time for predictable results
beforeAll(() => {
  process.env.TZ = "UTC";
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2025-03-31T00:00:00Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("SalesVsInventoryTrend Component", () => {
  const mockMetricData: SalesAndInventoryTrend[] = [
    { date: new Date(Date.UTC(2025, 0, 1)), sales: 4000, inventory: 2400 },
    { date: new Date(Date.UTC(2025, 1, 1)), sales: 3000, inventory: 3100 },
    { date: new Date(Date.UTC(2025, 2, 1)), sales: 4200, inventory: 2800 }
  ];

  const metricRange: MetricTimeRange = {
    startDate: new Date(Date.UTC(2025, 0, 1)),
    endDate: new Date(Date.UTC(2025, 2, 31))
  };

  it("renders chart title with correct date range", () => {
    render(
      <SalesVsInventoryTrend
        metricData={mockMetricData}
        metricRange={metricRange}
      />
    );

    // Verify header text exists and shows correct formatted range
    const header = screen.getByText(/Sales vs Inventory Trend/i);
    expect(header).toBeInTheDocument();
    expect(header.textContent).toContain("2025"); // ensures date range is shown
  });

  it("renders 'No data available' when dataset is empty", () => {
    render(<SalesVsInventoryTrend metricData={[]} metricRange={metricRange} />);
    expect(screen.getByText(/No data available/i)).toBeInTheDocument();
  });

  it("renders with correct legend labels for Sales and Inventory", () => {
    render(
      <SalesVsInventoryTrend
        metricData={mockMetricData}
        metricRange={metricRange}
      />
    );
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Inventory")).toBeInTheDocument();
  });
});
