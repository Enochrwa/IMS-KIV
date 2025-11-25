import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NoCategoryFound from "../NoCategoryFound";

describe("NoCategoryFound", () => {
  const theme = createTheme();

  const renderWithTheme = (props = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <NoCategoryFound {...props} />
      </ThemeProvider>
    );

  it("renders correctly without Add button and matches snapshot", () => {
    const { asFragment } = renderWithTheme();

    expect(screen.getByText(/No Categories Found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You haven’t added any categories yet/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Add New Category/i })
    ).not.toBeInTheDocument();

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders Add New Category button when onAddClick is provided", () => {
    const mockAddClick = jest.fn();
    renderWithTheme({ onAddClick: mockAddClick });

    const addButton = screen.getByRole("button", { name: /Add New Category/i });
    expect(addButton).toBeInTheDocument();
  });

  it("calls onAddClick when Add button is clicked", () => {
    const mockAddClick = jest.fn();
    renderWithTheme({ onAddClick: mockAddClick });

    const addButton = screen.getByRole("button", { name: /Add New Category/i });
    fireEvent.click(addButton);

    expect(mockAddClick).toHaveBeenCalledTimes(1);
  });
});
