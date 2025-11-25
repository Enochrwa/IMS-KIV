import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import "@testing-library/jest-dom";
import Topbar from "../Topbar";
import { PAGE_PORTAL_DASHBOARD } from "../../../PageRoutes";

// Mock react-router hooks
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: jest.fn(),
    useLocation: jest.fn()
  };
});

jest.mock("@tanstack/react-query", () => ({
  useIsFetching: jest.fn(),
  useIsMutating: jest.fn()
}));

describe("Topbar Component", () => {
  const mockNavigate = jest.fn();
  const mockUseNavigate = useNavigate as jest.Mock;
  const mockUseLocation = useLocation as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  test("renders correctly and matches snapshot", () => {
    mockUseLocation.mockReturnValue({ pathname: "/portal" });

    const { asFragment } = render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  test("shows 'Home' when path equals PAGE_PORTAL_DASHBOARD", () => {
    mockUseLocation.mockReturnValue({ pathname: `/${PAGE_PORTAL_DASHBOARD}` });

    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("shows last path segment as title for nested routes", () => {
    mockUseLocation.mockReturnValue({ pathname: "/portal/inventory/products" });

    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    expect(screen.getByText("products")).toBeInTheDocument();
  });

  test("navigates back when back button is clicked", () => {
    mockUseLocation.mockReturnValue({ pathname: "/portal/inventory" });

    render(
      <MemoryRouter>
        <Topbar />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
