import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddCategoryModal from "../AddCategoryModal";

// ✅ Mock the useCreateCategory hook (so no API call)
jest.mock("../../../hooks/api/useCategory", () => ({
  useCreateCategory: () => ({
    mutateAsync: jest.fn(),
    isPending: false
  })
}));

describe("AddCategoryModal (simplified)", () => {
  const setup = (open = true, onClose = jest.fn()) =>
    render(<AddCategoryModal open={open} onClose={onClose} />);

  it("renders correctly when open", () => {
    setup();
    expect(screen.getByText(/Add New Category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category Name/i)).toBeInTheDocument();
  });

  it("shows validation error when submitting empty form", async () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /Add Category/i }));
    expect(
      await screen.findByText(/Category name is required/i)
    ).toBeInTheDocument();
  });

  it("calls onClose when clicking close icon", () => {
    const onClose = jest.fn();
    setup(true, onClose);

    // The CloseIcon is inside a button
    const closeButton = screen.getByRole("button", { name: "" }); // only button without label
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });
});
