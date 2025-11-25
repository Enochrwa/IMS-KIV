import React from "react";
import { render, screen } from "@testing-library/react";
import ProfileSkeleton from "../ProfileSkeleton";
import "@testing-library/jest-dom";

describe("ProfileSkeleton Component", () => {
  it("renders root card with accessibility attributes", () => {
    render(<ProfileSkeleton />);
    const card = screen.getByTestId("profile-skeleton");

    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("aria-busy", "true");
    expect(card).toHaveAttribute("role", "progressbar");
  });

  it("renders multiple skeleton placeholders", () => {
    const { container } = render(<ProfileSkeleton />);

    // Query all Skeleton components
    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThanOrEqual(10);
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<ProfileSkeleton />);
    expect(asFragment()).toMatchSnapshot();
  });
});
