import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import PasswordChangeForm from "../PasswordChangeForm";

// ✅ Mock translation
jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({ t: (_: string, def: string) => def })
}));

// ✅ Mock useChangePassword hook
const mockMutateAsync = jest.fn();
jest.mock("../../../hooks/api/useProfile", () => ({
  useChangePassword: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false
  })
}));

describe("PasswordChangeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields and buttons", () => {
    const { asFragment } = render(<PasswordChangeForm />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<PasswordChangeForm />);
    fireEvent.click(screen.getByRole("button", { name: "Change Password" }));

    await waitFor(() => {
      expect(
        screen.getByText("Current password is required")
      ).toBeInTheDocument();
      expect(screen.getByText("New password is required")).toBeInTheDocument();
      expect(
        screen.getByText("Please confirm your password")
      ).toBeInTheDocument();
    });
  });

  it("resets form fields when Reset button clicked", async () => {
    render(<PasswordChangeForm />);

    const current = screen.getByLabelText("Current Password");
    const newPass = screen.getByLabelText("New Password");
    const confirm = screen.getByLabelText("Confirm New Password");

    fireEvent.change(current, { target: { value: "oldPass123" } });
    fireEvent.change(newPass, { target: { value: "newPass123" } });
    fireEvent.change(confirm, { target: { value: "newPass123" } });

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    await waitFor(() => {
      expect(current).toHaveValue("");
      expect(newPass).toHaveValue("");
      expect(confirm).toHaveValue("");
    });
  });
});
