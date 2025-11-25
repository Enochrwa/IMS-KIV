import React from "react";
import { render, screen } from "@testing-library/react";
import AuthRightSidePanel from "../AuthRightSidePanel";

// 🧱 Mock the Topbar component since we only need to verify it's rendered
jest.mock("../../../Navigation/Topbar", () => ({
  __esModule: true,
  default: ({ isAuthFlow }: { isAuthFlow?: boolean }) => (
    <div
      data-testid="mock-topbar"
      data-isauthflow={isAuthFlow ? "true" : "false"}
    >
      Mock Topbar
    </div>
  )
}));

describe("AuthRightSidePanel Component", () => {
  it("renders the Topbar and children correctly", () => {
    render(
      <AuthRightSidePanel>
        <div data-testid="child-content">Test Child</div>
      </AuthRightSidePanel>
    );

    // ✅ Topbar should render with `isAuthFlow` = true
    const topbar = screen.getByTestId("mock-topbar");
    expect(topbar).toBeInTheDocument();
    expect(topbar).toHaveAttribute("data-isauthflow", "true");

    // ✅ Children should render inside the Box
    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeVisible();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <AuthRightSidePanel>
        <div>Snapshot Child</div>
      </AuthRightSidePanel>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
