import React from "react";
import { render, screen } from "@testing-library/react";
import MostSoldProductsChart from "../MostSoldProductsChart";
import { ProductData } from "../../types/dashboardTypes";

const mockProductData: ProductData[] = [
  { name: "Laptop", percent: 45 },
  { name: "Shoes", percent: 30 },
  { name: "Headphones", percent: 25 }
];

describe("MostSoldProductsChart", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <MostSoldProductsChart productData={mockProductData} />
    );

    expect(screen.getByText("Most Sold Products")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot - empty ", () => {
    const { asFragment } = render(<MostSoldProductsChart productData={[]} />);

    expect(screen.getByText("Most Sold Products")).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
