import React from "react";
import { render, screen } from "@testing-library/react";
import AuthSidePanel from "../AuthSidePanel";

// ✅ Mock translation hook
jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({
    t: (_key: string, fallback: string) => fallback
  })
}));

describe("AuthSidePanel", () => {
  it("renders the main container", () => {
    render(<AuthSidePanel />);
    const container = screen.getByTestId("auth-left-panel");
    expect(container).toBeInTheDocument();
  });

  it("renders the logo correctly", () => {
    render(<AuthSidePanel />);
    const logo = screen.getByTestId("auth-logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("alt", "Kivu IMS Logo");
  });

  it("renders the intro text", () => {
    render(<AuthSidePanel />);
    const introText = screen.getByTestId("auth-left-text");
    expect(introText).toBeInTheDocument();
    expect(introText.textContent).toContain(
      "Re-imagining inventory management experience with advance data analytics for optimum performance"
    );
  });

  it("renders the footer text", () => {
    render(<AuthSidePanel />);
    const footer = screen.getByTestId("auth-left-footer");
    expect(footer).toBeInTheDocument();
    expect(footer.textContent).toBe("© kivunova 2025");
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<AuthSidePanel />);
    expect(asFragment()).toMatchSnapshot();
  });
});
