import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CategoryRow from "../CategoryRow";
import { CATEGORY_STATUS } from "../enums/categoryEnums";
import { CategoryNode } from "../types/categoryTypes";

describe("CategoryRow", () => {
  const theme = createTheme();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const categoryTree: CategoryNode = {
    id: "1",
    name: "Electronics",
    path: "Electronics",
    depth: 0,
    status: CATEGORY_STATUS.ACTIVE,
    companyId: "c1",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z",
    children: [
      {
        id: "2",
        name: "Phones",
        path: "Electronics/Phones",
        depth: 1,
        status: CATEGORY_STATUS.ACTIVE,
        companyId: "c1",
        createdBy: "admin",
        createdAt: "2025-01-02T00:00:00Z",
        children: []
      }
    ]
  };

  const renderRow = () =>
    render(
      <ThemeProvider theme={theme}>
        <table>
          <tbody>
            <CategoryRow
              category={categoryTree}
              onEdit={mockOnEdit}
              onDelete={mockOnDelete}
            />
          </tbody>
        </table>
      </ThemeProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = renderRow();
    // It renders multiple "Electronics", so we use getAllByText
    const electronics = screen.getAllByText("Electronics");
    expect(electronics.length).toBeGreaterThan(0);
    expect(asFragment()).toMatchSnapshot();
  });
});
