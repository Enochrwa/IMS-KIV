import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import EditCategoryModal from "../EditCategoryModal";
import { CATEGORY_STATUS } from "../enums/categoryEnums";
import { useUpdateCategory } from "../../../hooks/api/useCategory";

jest.mock("../../../hooks/api/useCategory", () => ({
  useUpdateCategory: jest.fn()
}));

describe("EditCategoryModal", () => {
  const theme = createTheme();
  const mockOnClose = jest.fn();
  const mockMutateAsync = jest.fn();

  const mockCategory = {
    id: "cat123",
    name: "Electronics",
    description: "Devices and gadgets",
    parentId: null,
    path: "Electronics",
    depth: 0,
    status: CATEGORY_STATUS.ACTIVE,
    companyId: "comp1",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateCategory as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false
    });
  });

  const renderModal = (open = true) =>
    render(
      <ThemeProvider theme={theme}>
        <EditCategoryModal
          open={open}
          onClose={mockOnClose}
          category={mockCategory}
        />
      </ThemeProvider>
    );

  it("renders snapshot correctly", () => {
    const { asFragment } = renderModal();
    expect(screen.getByText(/Edit Category/i)).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows validation error when name is empty", async () => {
    renderModal();

    const nameInput = screen.getByLabelText(/Category Name/i);
    fireEvent.change(nameInput, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Category name is required/i)
      ).toBeInTheDocument();
    });
  });

  it("calls onClose when close icon is clicked", () => {
    renderModal();
    const closeIconButton = screen.getAllByRole("button")[0]; // First button = close icon
    fireEvent.click(closeIconButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("does nothing when closed", () => {
    renderModal(false);
    expect(screen.queryByText(/Edit Category/i)).not.toBeInTheDocument();
  });
});
