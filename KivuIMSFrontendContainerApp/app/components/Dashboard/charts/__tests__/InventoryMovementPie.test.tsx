import React from "react";
import { render, screen } from "@testing-library/react";
import InventoryMovementPie from "../InventoryMovementPie";
import { CategoryData } from "../../types/dashboardTypes";

const mockMovementData: CategoryData[] = [
  { label: "Inbound", value: 45 },
  { label: "Outbound", value: 35 },
  { label: "Returned", value: 20 }
];

describe("InventoryMovementPie", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <InventoryMovementPie movement={mockMovementData} />
    );

    expect(
      screen.getByText("Inventory Movement Landscape")
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("matches snapshot - empty", () => {
    const { asFragment } = render(<InventoryMovementPie movement={[]} />);

    expect(
      screen.getByText("Inventory Movement Landscape")
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });
});
