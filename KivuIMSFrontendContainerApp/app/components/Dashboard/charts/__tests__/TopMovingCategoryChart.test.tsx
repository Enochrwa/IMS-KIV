import React from "react";
import { render } from "@testing-library/react";
import TopMovingCategoryChart from "../TopMovingCategoryChart";
import { CategoryData } from "../../types/dashboardTypes";

// Mock data
const mockCategoryData: CategoryData[] = [
  { label: "Electronics", value: 40 },
  { label: "Clothing", value: 25 },
  { label: "Groceries", value: 35 }
];

describe("TopMovingCategoryChart", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <TopMovingCategoryChart categoryData={mockCategoryData} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without crashing - empty", () => {
    const { asFragment } = render(<TopMovingCategoryChart categoryData={[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
