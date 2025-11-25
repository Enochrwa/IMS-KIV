import React from "react";
import { render, screen } from "@testing-library/react";
import CustomProgressBar from "../CustomProgressBar";
import "@testing-library/jest-dom";

// ✅ Mock React Query hooks
jest.mock("@tanstack/react-query", () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn()
}));

const { useIsFetching, useIsMutating } = jest.requireMock(
  "@tanstack/react-query"
);

describe("CustomProgressBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders hidden (opacity 0) when not loading", () => {
    (useIsFetching as jest.Mock).mockReturnValue(0);
    (useIsMutating as jest.Mock).mockReturnValue(0);

    const { container } = render(<CustomProgressBar />);
    const wrapper = container.querySelector("div");

    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveStyle("opacity: 0");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("renders active progress bar when loading", () => {
    (useIsFetching as jest.Mock).mockReturnValue(1);
    (useIsMutating as jest.Mock).mockReturnValue(0);

    render(<CustomProgressBar />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle("height: 100%");
  });

  it("renders also when mutating", () => {
    (useIsFetching as jest.Mock).mockReturnValue(0);
    (useIsMutating as jest.Mock).mockReturnValue(2);

    render(<CustomProgressBar />);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("matches snapshot when visible", () => {
    (useIsFetching as jest.Mock).mockReturnValue(1);
    (useIsMutating as jest.Mock).mockReturnValue(1);

    const { asFragment } = render(<CustomProgressBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
