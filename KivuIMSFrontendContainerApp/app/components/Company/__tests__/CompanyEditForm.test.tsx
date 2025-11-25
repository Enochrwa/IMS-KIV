import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CompanyEditForm from "../CompanyEditForm";
import profileReducer from "../../../store/slices/profileSlice";
import { CompanyData } from "../../Profile/types/profileTypes";

// ✅ Mock translation
jest.mock("@kivunova/kivufrontendcommon", () => ({
  useKivunovaTranslation: () => ({ t: (_: string, def: string) => def })
}));

// ✅ Mock useUpdateCompany hook
const mockMutateAsync = jest.fn();
jest.mock("../../../hooks/api/useCompany", () => ({
  useUpdateCompany: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false
  })
}));

// ✅ Helper to create store
const makeStore = (companyData?: CompanyData) =>
  configureStore({
    reducer: { profile: profileReducer },
    preloadedState: {
      profile: { companyData }
    }
  });

// ✅ Mock data
const mockCompanyData = {
  id: "1",
  name: "Kivunova Ltd",
  businessType: "Tech",
  currencyCode: "RWF",
  registrationNumber: "REG-123",
  description: "Software company",
  address: {
    country: "Rwanda",
    province: "Northern",
    district: "Musanze",
    sector: "Muhoza",
    cell: "Kigali",
    village: "Nyirangarama",
    streetAddress: "Main Street 12"
  }
} as CompanyData;

describe("CompanyEditForm", () => {
  const renderWithStore = (
    companyData = mockCompanyData,
    onClose = jest.fn()
  ) => {
    const store = makeStore(companyData);
    return render(
      <Provider store={store}>
        <CompanyEditForm onClose={onClose} />
      </Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all fields and buttons", () => {
    const { asFragment } = renderWithStore();
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText("Edit Company Details")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    // Render form with a blank company name
    renderWithStore({ ...mockCompanyData, name: "" });

    // Clear 'name' field and submit
    const nameInput = screen.getByLabelText("name");
    fireEvent.change(nameInput, { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Validation should display error message
    await waitFor(() => {
      expect(screen.getByText("Company name is required")).toBeInTheDocument();
    });
  });

  it("calls mutateAsync and onClose when submitting valid form", async () => {
    const onClose = jest.fn();
    renderWithStore(mockCompanyData, onClose);

    const nameInput = screen.getByLabelText("name");
    fireEvent.change(nameInput, { target: { value: "Updated Company" } });

    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        ...mockCompanyData,
        name: "Updated Company"
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when clicking Cancel button", async () => {
    const onClose = jest.fn();
    renderWithStore(mockCompanyData, onClose);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });
});
