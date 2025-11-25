import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DateRangeSelector from "../DateRangeSelector";
import { format } from "date-fns";

// Mock react-date-range to avoid rendering heavy calendar UI
jest.mock("react-date-range", () => ({
  DateRange: ({ onChange }: { onChange: (ranges: object) => void }) => (
    <div
      data-testid="mock-calendar"
      onClick={() =>
        onChange({
          selection: {
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-01-10")
          }
        })
      }
    >
      Mock Calendar
    </div>
  )
}));

// Mock MUI useMediaQuery (always large screen)
jest.mock("@mui/material/useMediaQuery", () => jest.fn(() => false));

describe("DateRangeSelector", () => {
  const onChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the trigger button with default range label", () => {
    render(<DateRangeSelector onChange={onChange} />);

    const triggerButton = screen.getByRole("button", {
      name: /–/i
    });
    expect(triggerButton).toBeInTheDocument();
  });

  it("opens popover when button is clicked", async () => {
    render(<DateRangeSelector onChange={onChange} />);

    const triggerButton = screen.getByRole("button", { name: /–/i });
    fireEvent.click(triggerButton);

    await waitFor(() => {
      expect(screen.getByTestId("mock-calendar")).toBeInTheDocument();
    });
  });

  it("calls onChange when Apply button is clicked after selecting new date", async () => {
    render(<DateRangeSelector onChange={onChange} />);

    // Open picker
    fireEvent.click(screen.getByRole("button", { name: /–/i }));

    // Simulate calendar date selection
    const calendar = await screen.findByTestId("mock-calendar");
    fireEvent.click(calendar);

    // Click Apply
    fireEvent.click(screen.getByRole("button", { name: /Apply/i }));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-10")
      });
    });
  });

  it("does not call onChange when Cancel is clicked", async () => {
    render(<DateRangeSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /–/i }));

    const cancelButton = await screen.findByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders sidebar shortcuts", async () => {
    render(<DateRangeSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /–/i }));

    expect(await screen.findByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Last 7 Days")).toBeInTheDocument();
    expect(screen.getByText("YTD")).toBeInTheDocument();
    expect(screen.getByText("5 Years")).toBeInTheDocument();
  });

  it("applies preset when shortcut clicked", async () => {
    render(<DateRangeSelector onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /–/i }));

    const todayButton = await screen.findByText("Today");
    fireEvent.click(todayButton);

    // Apply changes
    fireEvent.click(screen.getByRole("button", { name: /Apply/i }));

    const today = new Date();
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        startDate: expect.any(Date),
        endDate: expect.any(Date)
      });
      const args = onChange.mock.calls[0][0];
      expect(format(args.startDate, "yyyy-MM-dd")).toBe(
        format(today, "yyyy-MM-dd")
      );
      expect(format(args.endDate, "yyyy-MM-dd")).toBe(
        format(today, "yyyy-MM-dd")
      );
    });
  });
});
