import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DeleteCategoryModal from "../DeleteCategoryModal";
import { CATEGORY_STATUS } from "../enums/categoryEnums";
import { useDeleteCategory } from "../../../hooks/api/useCategory";

// 🧩 Mock API hook
jest.mock("../../../hooks/api/useCategory", () => ({
  useDeleteCategory: jest.fn()
}));

describe("DeleteCategoryModal", () => {
  const theme = createTheme();
  const mockOnClose = jest.fn();
  const mockMutateAsync = jest.fn();

  const category = {
    id: "123",
    name: "Electronics",
    path: "Electronics",
    depth: 0,
    status: CATEGORY_STATUS.ACTIVE,
    companyId: "comp1",
    createdBy: "admin",
    createdAt: "2025-01-01T00:00:00Z"
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteCategory as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false
    });
  });

  const renderModal = (open = true) =>
    render(
      <ThemeProvider theme={theme}>
        <DeleteCategoryModal
          open={open}
          onClose={mockOnClose}
          category={category}
        />
      </ThemeProvider>
    );

  it("renders correctly and matches snapshot", () => {
    const { asFragment } = renderModal(true);
    expect(
      screen.getByText(/Do you really want to delete this category/i)
    ).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it("calls onClose when 'No' button is clicked", () => {
    renderModal(true);
    const cancelButton = screen.getByRole("button", { name: /No/i });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls mutateAsync and closes when 'Yes' is clicked", async () => {
    renderModal(true);

    const yesButton = screen.getByRole("button", { name: /Yes/i });
    fireEvent.click(yesButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({ id: "123" });
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it("handles API failure gracefully", async () => {
    (useDeleteCategory as jest.Mock).mockReturnValue({
      mutateAsync: jest.fn().mockRejectedValue(new Error("API error")),
      isPending: false
    });

    renderModal(true);

    const yesButton = screen.getByRole("button", { name: /Yes/i });
    fireEvent.click(yesButton);

    // Should not throw; just logs to console.error
    await waitFor(() => {
      expect(
        screen.getByText(/Do you really want to delete/i)
      ).toBeInTheDocument();
    });
  });

  it("renders nothing when modal is closed", () => {
    renderModal(false);
    expect(
      screen.queryByText(/Do you really want to delete this category/i)
    ).not.toBeInTheDocument();
  });
});
