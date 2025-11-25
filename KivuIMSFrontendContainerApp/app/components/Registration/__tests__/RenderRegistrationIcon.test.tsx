import React from "react";
import { render, screen } from "@testing-library/react";
import RenderRegistrationIcon from "../RenderRegistrationIcon";
import { BRAND_COLOR } from "../../common/constants/colors";

describe("RenderRegistrationIcon (unit)", () => {
  it("renders PersonIcon for index 0", () => {
    render(<RenderRegistrationIcon index={0} activeStep={0} />);
    const icon = screen.getByTestId("PersonIcon");
    expect(icon).toBeInTheDocument();
  });

  it("renders BusinessIcon for index 1", () => {
    render(<RenderRegistrationIcon index={1} activeStep={1} />);
    const icon = screen.getByTestId("BusinessIcon");
    expect(icon).toBeInTheDocument();
  });

  it("renders StoreIcon for index 2", () => {
    render(<RenderRegistrationIcon index={2} activeStep={2} />);
    const icon = screen.getByTestId("StoreIcon");
    expect(icon).toBeInTheDocument();
  });

  it("renders PreviewIcon for index 3", () => {
    render(<RenderRegistrationIcon index={3} activeStep={3} />);
    const icon = screen.getByTestId("PreviewIcon");
    expect(icon).toBeInTheDocument();
  });

  it("applies active color when index <= activeStep", () => {
    const { container } = render(
      <RenderRegistrationIcon index={1} activeStep={2} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveStyle(`color: ${BRAND_COLOR}`);
  });

  it("applies inactive color when index > activeStep", () => {
    const { container } = render(
      <RenderRegistrationIcon index={3} activeStep={1} />
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveStyle("color: #ccc");
  });

  it("matches snapshot", () => {
    const { container } = render(
      <RenderRegistrationIcon index={2} activeStep={1} />
    );
    expect(container).toMatchSnapshot();
  });
});
