import React from "react";
import { render, screen } from "@testing-library/react";
import MetricCard from "../MetricCard";
import { KPI } from "../../../Dashboard/types/dashboardTypes";

// Mock SparkLineChart to avoid rendering complexity
jest.mock("@mui/x-charts/SparkLineChart", () => ({
  SparkLineChart: () => <div data-testid="sparkline-chart" />
}));

describe("MetricCard", () => {
  const baseKpi: KPI = {
    id: "rev",
    title: "Net Revenue",
    value: "$152K",
    trend: 12.4,
    positive: true,
    spark: [10, 20, 15, 30, 25]
  };

  const period = "last month";

  it("renders metric title and value", () => {
    render(<MetricCard kpiMetric={baseKpi} period={period} />);
    expect(screen.getByText("Net Revenue")).toBeInTheDocument();
    expect(screen.getByText("$152K")).toBeInTheDocument();
  });

  it("shows upward trend with positive color and icon", () => {
    render(<MetricCard kpiMetric={baseKpi} period={period} />);
    expect(screen.getByText(/↑ 12.4% vs last month/i)).toBeInTheDocument();
  });

  it("shows downward trend with red color when not positive", () => {
    const negativeKpi = { ...baseKpi, trend: -5.3, positive: false };
    render(<MetricCard kpiMetric={negativeKpi} period={period} />);
    expect(screen.getByText(/↓ -5.3% vs last month/i)).toBeInTheDocument();
  });

  it("renders the sparkline chart when data is present", () => {
    render(<MetricCard kpiMetric={baseKpi} period={period} />);
    expect(screen.getByTestId("sparkline-chart")).toBeInTheDocument();
  });

  it("does not render sparkline when data is missing", () => {
    const noSparkKpi = { ...baseKpi, spark: undefined };
    render(<MetricCard kpiMetric={noSparkKpi} period={period} />);
    expect(screen.queryByTestId("sparkline-chart")).not.toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <MetricCard kpiMetric={baseKpi} period={period} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
