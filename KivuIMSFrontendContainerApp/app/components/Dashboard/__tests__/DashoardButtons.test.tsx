import React from "react";
import { render } from "@testing-library/react";
import { AddMetricButton, FilterButton } from "../DashboardButton";

describe("Dashboard Buttons", () => {
  it("renders FilterButton and AddMetricButton correctly", () => {
    const { asFragment } = render(
      <>
        <FilterButton />
        <AddMetricButton />
      </>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
