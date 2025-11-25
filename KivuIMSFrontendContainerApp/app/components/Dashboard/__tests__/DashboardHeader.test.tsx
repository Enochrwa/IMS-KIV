import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardHeader from "../DashboardHeader";

// ✅ Mock child components to isolate DashboardHeader behavior
jest.mock("../DateRangeSelector", () => ({
  __esModule: true,
  default: ({
    value,
    onChange
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div data-testid="date-range-selector">
      <p>Date Range: {value}</p>
      <button onClick={() => onChange("3m")}>Change Period</button>
    </div>
  )
}));

jest.mock("../DashboardButton", () => ({
  __esModule: true,
  AddMetricButton: () => (
    <button data-testid="add-metric-btn">Add Metric</button>
  ),
  FilterButton: () => <button data-testid="filter-btn">Filters</button>
}));

describe("DashboardHeader", () => {
  const mockOnPeriodChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all expected child components", () => {
    render(<DashboardHeader onRangeChange={mockOnPeriodChange} />);

    expect(screen.getByTestId("date-range-selector")).toBeInTheDocument();
    expect(screen.getByTestId("add-metric-btn")).toBeInTheDocument();
    expect(screen.getByTestId("filter-btn")).toBeInTheDocument();
  });

  it("calls onPeriodChange when DateRangeSelector triggers change", () => {
    render(<DashboardHeader onRangeChange={mockOnPeriodChange} />);

    const changeBtn = screen.getByText("Change Period");
    fireEvent.click(changeBtn);

    expect(mockOnPeriodChange).toHaveBeenCalledTimes(1);
    expect(mockOnPeriodChange).toHaveBeenCalledWith("3m");
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = render(
      <DashboardHeader onRangeChange={mockOnPeriodChange} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
